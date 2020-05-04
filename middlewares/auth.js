const jwt = require('jsonwebtoken');
const config = require('config');


const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({ message: "User not authenticated" });

    try {
        const decoded = await jwt.verify(token, config.get('secretKey'));
        
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not validated'})
    }
}

module.exports = auth
