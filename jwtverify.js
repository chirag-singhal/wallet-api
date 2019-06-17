const jwt = require('jsonwebtoken');
const config = require('./config.js');

const checkToken = (req, res, next) => {
    if(req.path != '/auth/signup' && req.path != '/auth/login' && req.path != '/verifyUser' && req.path != '/verifyOtp'){
        const token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.json({
            success: false,
            message: 'Token is not valid'
            });
        } else {
            req.decoded = decoded;
            next();
        }
        });
    } else {
        return res.json({
        success: false,
        message: 'Auth token is not supplied'
        });
    }
    }
};

module.exports = checkToken