const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');

const Users = require('../models/users')

const updatePassword = express.Router();

updatePassword.use(bodyParser.json());

updatePassword.route('/')
.post((req, res, next) => {
    if(req.body.oldPassword && req.body.newPassword){
        Users.findById(req.user._id)
        .then((user) =>{
            bcrypt.compare(req.body.oldPassword, user.password)
                .then((result) => {
                    if(result == true){
                        bcrypt.hash(req.body.newPassword, 10)
                        .then((hashedPassword) => {
                            user.password = hashedPassword;
                            user.save().then((userSaved) => {
                                console.log(userSaved)
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({"message": "Password Updated"});
                            })
                            .catch((err) => next(err))
                        })
                        .catch((err) => next(err))
                    }
                    else{
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({"message": "Incorrect Password"});
                    }
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

module.exports = updatePassword