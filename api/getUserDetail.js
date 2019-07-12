const express = require('express')
const bodyParser = require('body-parser')

const Users = require('../models/users')

const userDetails = express.Router();
userDetails.use(bodyParser.json());

userDetails.route('/')
.get((req, res, next) => {
    Users.findById(req.user._id).then((user) => {
        if(user != null){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
                _id: req.user._id,
                username: user.username,
                contact: user.contact,
                email: user.email,
                countrycode: user.countrycode
            })
        } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.json({
                "message": "User not found!"
            })
        }
    })
})

module.exports = userDetails