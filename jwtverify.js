const jwt = require('jsonwebtoken');
const config = require('./config.js');
const User = require('./model/users');

const checkToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        const  decoded = jwt.verify(token, config.secret);

        const user = await User.findOne({ email: decoded.email, 'tokens.token': token });

        if(!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;

    } catch(e) {
        res.status(401).send({ error: "Please authenticate!" });
    }
};

module.exports = checkToken