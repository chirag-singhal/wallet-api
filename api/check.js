const express = require('express');
const bodyParser = require('body-parser');

const Users = require('../models/users')

const check = express.Router();

check.use(bodyParser.json());

check.route('/')
.post((req, res, next) => {
    Users.findOne({"conatct": req.body.conatct}).then((user) => {
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
})

module.exports = check