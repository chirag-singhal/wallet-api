const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');

const Users = require('../models/users')
const resetPassword = require('../models/resetPassword')
const verifyOtp = require('../api/verifyOtp')
const changePassword = express.Router()
changePassword.use(bodyParser.json())

changePassword.route('/')
    .post((req, res, next) => {
        if (req.body.token && req.body.password && req.body.otp) {
            resetPassword.findOne({ "token": req.body.token })
                .then((reset) => {
                    Users.findOne({ "contact": reset.contact })
                        .then((user) => {
                            if (user != null) {
                                if (reset != null) {
                                    const time = new Date()
                                    time.setSeconds(time.getSeconds() - 300)
                                    if (reset.updatedAt > time) {
                                        verifyOtp(user.contact, req.body.otp, function(result) {
                                            console.log(result, result)
                                            if (result) {
                                                bcrypt.hash(req.body.password, 10)
                                                    .then((hashedPassword) => {
                                                        user.password = hashedPassword;
                                                    })
                                                    .catch((err) => next(err))
                                                user.save()
                                                    .then(() => {
                                                        res.statusCode = 200;
                                                        res.setHeader('Content-Type', 'application/json');
                                                        res.json({ "message": "Password changed" });
                                                    })
                                                    .catch((err) => next(err))
                                            }
                                            else {
                                                res.statusCode = 403;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.json({ "message": "Wrong Otp" });
                                            }
                                        })


                                    }
                                    else {
                                        res.statusCode = 403;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({ message: "Token Expired" });
                                    }
                                }
                                else {
                                    res.statusCode = 403;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end("Token not found");
                                }
                            }
                            else {
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.end("User not found");
                            }
                        })
                })
                .catch((err) => {
                    console.log(err)
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(err)
                })
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end("Missing Fields");
        }
    })

module.exports = changePassword