const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');

const Users = require('../model/users')

const updatePassword = express.Router();

updatePassword.use(bodyParser.json());

updatePassword.route('/')
.post((req, res, next) => {
    if(req.body.userId && req.body.oldPassword && req.body.newPassword){
        Users.findById(req.body.userId)
        .then((user) =>{
            bcrypt.compare(req.body.oldPassword, user.password)
                .then((result) => {
                    if(result == true){
                        user.password = req.body.newPassword;
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