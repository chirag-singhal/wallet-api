const jwt = require('jsonwebtoken');
const config = require('./config.js');
const User = require('./models/delivery');

const checkToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers['authorization'].replace("Bearer ", ""); // Express headers are auto converted to lowercase
        const  decoded = jwt.verify(token, config.secret);

        const user = await User.findOne({ email: decoded.email, 'tokens.token': token });
        console.log(user)
        if(!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch(e) {
        res.status(401).send({ error: "Please authenticate!" });
    }
};

module.exports = checkToken