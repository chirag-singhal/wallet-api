const express = require('express')
const bodyParser = require('body-parser')

const Users = require('../models/users')

const updateProfile = express.Router();

updateProfile.use(bodyParser.json());

updateProfile.route('/')
.post((req, res) => {

   
    
    if(req.body.username && req.body.email){
        Users.findById(req.user._id)
        .then((user) => {
            Users.findOne({email: req.body.email})
            .then((user) => {
                if(user == null){
                    Users.findOne({username: req.body.username})
                    .then((user) => {
                        if(user == null){
                            user.username = req.body.username;
                            user.email = req.body.email;
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
                        } else {
                            res.statusCode = 403;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({"message": "username already registered"})
                        }
                    })
                } else {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({"message": "email already registered"})
                }
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