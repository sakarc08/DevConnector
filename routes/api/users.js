const express = require('express');
const config = require('config');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator')
const router = express.Router();

router.post('/register', [
    check('name', 'Please enter a valid username').not().isEmpty(),
    check('email', 'Please enter a unique Emaild ID').isEmail(),
    check('password', 'Please enter valid password').isLength({
        min: 6
    })
], async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ errors: [{ message: 'user already registered'}]});
    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    });

    user = new User({
        name,
        email,
        password,
        avatar
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(payload, config.get('secretKey'), { expiresIn: 3600 }, (err, token) => res.json({ token }));
});

module.exports = router