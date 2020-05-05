const express = require('express');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();

router.get('/user/:id', async (req, res) => { 
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name', 'avatar']);
        if(!profile) return res.status(400).json({ message: 'Profile not found'});
        res.json(profile);   
    } catch (error) {
        if(error.kind == "ObjectId") res.status(400).json({ message: 'Profile not found'});
        res.status(500).json({ message: 'Server error'});
    }
});

router.get('/', async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.log(error.message);
        res.send(500).send('Failed to fetch all profiles')
    }
});


router.get('/me', auth, async (req, res) => { 
    const userId = req.user.id;
    try {
        const profile = await Profile.findOne({ user: userId }).populate('User', ['name', 'avatar']);
        if (!profile) return res.status(400).json({ message: 'No profile for the requested User'});
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
});

router.post('/', [ [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty(),
], auth] , async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array()});

        const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;
        const profile = {};
        profile.user = req.user.id;
        if(company) profile.company = company;
        if(website) profile.website = website
        if(location) profile.location = location
        if(bio) profile.bio = bio
        if(status) profile.status = status  
        if(githubusername) profile.githubusername = githubusername
        if(skills) profile.skills = skills.split(',').map(skill => skill.trim());

        profile.social = {};
        if(youtube) profile.social.youtube = youtube
        if(linkedin) profile.social.linkedin = linkedin
        if(instagram) profile.social.instagram = instagram;
        if(facebook) profile.social.facebook = facebook;
        if(twitter) profile.social.twitter = twitter;

        try {
            let newProfile = await Profile.findOne({ user: req.user.id});
            if(newProfile) {
                newProfile = await Profile.findOneAndUpdate({ user: req.user.id }, {$set: profile}, {new: true});
                res.json(newProfile);
            }

            newProfile = Profile(profile);
            await newProfile.save();
            res.json(newProfile);
        } catch (error) {
            console.log(error.message);
        }
        
    } catch (error) {
        console.log(error.message);   
    }
})

router.delete('/', auth, async (req, res) => { 
    const userId = req.user.id;
    try {
        await Profile.findOneAndRemove({ user: userId });
        await User.findOneAndRemove({ _id: userId });
        res.json({ message: 'User Profile deleted' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
});

router.put('/experience', [auth,
check('title', 'Title is required').not().isEmpty(),
check('company', 'Company is required').not().isEmpty(),
check('from', 'From date is required').not().isEmpty()], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array()})

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description  
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error'})
    }
});

router.delete('/experience/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.send(profile)
    } catch (error) {
        console.log(error.message);
        res.send('Server error')
    }
})


router.put('/education', [auth,
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Fields of Study is required').not().isEmpty()], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array()})
    
        const { school, degree, fieldofstudy, from, to, current, description } = req.body;
    
        const newEducation = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description  
        };
    
        try {
            const profile = await Profile.findOne({ user: req.user.id});
            profile.education.unshift(newEducation);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'Server error'})
        }
});

router.delete('/education/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.send(profile)
    } catch (error) {
        console.log(error.message);
        res.send('Server error')
    }
});

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecretKey')}`,
            headers: { 'user-agent': "node.js"},
            method: 'GET'
        }

        request(options, (error, response, body) => {
            if(error) console.error(error);
            if(response.statusCode !== 200) return res.status(404).json({ error: 'No github repos found'})
            res.json(JSON.parse(body));
        })

    } catch (error) {
        console.log(error.message);
        res.send("server error")
    }
});

module.exports = router