const express = require('express');
const bodyParser = require('body-parser');

const Users = require('../models/users')

const check = express.Router();

check.use(bodyParser.json());

check.route('/')
.post(async (req, res, next) => {
        const user = await User.findOne({ 'contact': req.body.contact })
        console.log(user)
        console.log(req.body)
        if(user) {
            res.json({
                "username": user.username,
                "found": true
            })
        }
        else {
            res.json({
                "found": false
            })
        }
})

module.exports = check