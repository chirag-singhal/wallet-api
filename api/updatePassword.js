const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');

const Users = require('../models/users')

const updatePassword = express.Router();

updatePassword.use(bodyParser.json());

updatePassword.route('/')
.post((req, res, next) => {
    if(req.body.username && req.body.oldPassword && req.body.newPassword){
        Users.findOne({ "username": req.body.username}).exec()
        .then((user) =>{
            bcrypt.compare(req.body.oldPassword, user.password)
                .then((result) => {
                    if(result == true){
                        bcrypt.hash(req.body.newPassword, 10)
                        .then((hashedPassword) => {
                            user.password = hashedPassword;
                        })
                        .catch((err) => next(err))
                        
                        user.save()
                        .then((userSaved) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(userSaved);
                        })
                        .catch((err) => next(err))
                    }
                    else{
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("Incorrect Password");
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