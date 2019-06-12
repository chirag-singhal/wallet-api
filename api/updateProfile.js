const express = require('express')
const bodyParser = require('body-parser')

const Users = require('../model/users')

const updateProfile = express.Router();

updateProfile.use(bodyParser.json());

updateProfile.route('/')
.post((req, res) => {
    if(req.body.userId && req.body.username && req.body.email && req.body.address){
        Users.findById(req.body.userId)
        .then((user) => {
            user.username = req.body.username;
            user.email = req.body.email;
            user.address = req.body.address;
            user.save()
            .then((userSaved) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(userSaved);
            })
            .catch((err) => {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end(err);
                console.log(err);
            })
        })
    }
    else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end("Missing Fields");
    }
})

module.exports = updateProfile