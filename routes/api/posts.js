const express = require('express');
const auth = require('../../middlewares/auth');
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const router = express.Router();

router.post('/',[auth, [
    check('text', 'Text is required').not().isEmpty(),

]], async (req, res) =>  {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(500).json({ errors: errors.array()});
    try {
        const user = await User.findOne({_id: req.user.id }).select("-password");
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        const post = Post(newPost);
        await post.save();

        res.json(post);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).send('Post not found');
        res.json(post)
    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId') return res.status(404).send('Post not found');
        res.status(500).send('Server error')
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).send('Post not found');
        if(post.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized'});
        await post.remove();
        res.json({ message: 'Post deleted'})
    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId') return res.status(404).send('Post not found');
        res.status(500).send('Server error')
    }
})

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).send('Post not found');
        if(post.likes.filter(item => item.user.toString() === req.user.id).length > 0) return res.status(400).json({ message: 'Post already liked'})
        post.likes.unshift({ user: req.user.id});
        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId') return res.status(404).send('Post not found');
        res.status(500).send('Server error')
    }
})

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).send('Post not found');
        if(post.likes.filter(item => item.user.toString() === req.user.id).length === 0) return res.status(400).json({ message: 'Post has not been liked yet'})
        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1)
        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId') return res.status(404).send('Post not found');
        res.status(500).send('Server error')
    }
})

/*
=====================================================

*/

router.post('/comment/:id',[auth, [
    check('text', 'Text is required').not().isEmpty(),

]], async (req, res) =>  {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(500).json({ errors: errors.array()});
    try {
        const user = await User.findOne({_id: req.user.id }).select("-password");
        const post = await Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
});


router.delete('/comment/:id/:commentId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).send('Post not found');
        
        const comment = post.comments.find(item => item.id === req.params.commentId);
        if(!comment) return res.status(404).send('Comment does not exist');

        if(comment.user.toString() !== req.user.id) return res.status(401).send('User not authorized');

        const removeIndex = post.comments.map(item => item.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1)
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId') return res.status(404).send('Post not found');
        res.status(500).send('Server error')
    }
})

module.exports = router