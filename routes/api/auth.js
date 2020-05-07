const express = require('express');
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const auth = require('../../middlewares/auth');
const User = require('../../models/User')
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const id = req.user.id;
    try {
        const user = await User.findById({_id: id}).select('-password')
        res.json({ user});   
    } catch (error) {
       res.status(500).send({ error: { message: error.message }}) 
    }
})

router.post('/', [
    check('email', 'Email not valid').isEmail(),
    check('password', 'Password not valid').exists()
], async (req, res) => {
    const errors = validationResult(req.body);
    if(!errors.isEmpty()) return res.status(501).json({ errors })

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(501).json({ errors: { message: "User not valid "}})
        const isSameUser = await bcrypt.compare(password, user.password);
        if(!isSameUser) return res.status(501).json({ errors: [{ message: 'Invalid Credentials' }] });

        const payload = {
            user: {
                id: user.id
            }
        }

        const token = await jwt.sign(payload, config.get('secretKey'), { expiresIn: 3600 });
        res.status(200).json({ token });
    } catch (error) {
        console.log(error.message);
    } 
})

module.exports = router