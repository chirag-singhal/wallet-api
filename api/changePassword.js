const express = require('express')
const bodyParser = require('body-parser')

const Users = require('../models/users')
const resetPassword = require('../models/resetPassword')

const changePassword = express.Router()
changePassword.use(bodyParser.json())

changePassword.route('/')
.get((req, res, next) => {
    if(req.body.contact && req.body.token && req.body.password){
        Users.findOne({ "contact": req.body.contact }).exec()
        .then((user) =>{
            if(user != null){
                resetPassword.findOne({ "contact": req.body.contact }).exec()
                .then((reset) => {
                    if(reset != null){
                        const time = new Date()
                        time.setSeconds(time.getSeconds() - 300)
                        if(reset.updatedAt > time){
                            bcrypt.compare(req.body.token, reset.token)
                            .then((result) => {
                                if(result == true){
                                    bcrypt.hash(req.body.password, 10)
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
                                    res.end("Incorrect Token");
                                }
                            })
                        }
                        else{
                            res.statusCode = 403;
                            res.setHeader('Content-Type', 'application/json');
                            res.end("Token Expired");
                        }
                    }
                    else{
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("Token not found");
                    }
                })
            }
            else{
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end("User not found");
            }
        })
        .catch((err) => {
            console.log(err)
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json(err)
        })
    }
    else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end("Missing Fields");
    }
})

module.exports = changePassword