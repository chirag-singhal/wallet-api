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
        console.log(req.body)
        if (req.body.token && req.body.password && req.body.otp) {
            resetPassword.findOne({ "token": req.body.token })
                .then((reset) => {
                    console.log(reset)
                    Users.findOne({ "contact": reset.contact })
                        .then((user) => {
                            console.log(user)
                            if (user != null) {
                                if (reset != null) {
                                    const time = new Date()
                                    time.setSeconds(time.getSeconds() - 300)
                                    if (reset.updatedAt > time) {
                                        verifyOtp(user.contact, req.body.otp, async function (result) {
                                            console.log(result, result)
                                            if (result) {
                                                console.log(req.body.password)
                                                let hashPassword;
                                                bcrypt.hash(req.body.password, 10)
                                                    .then((hashedPassword) => {
                                                        console.log(hashedPassword)
                                                        hashPassword = hashedPassword;
                                                        user.password = hashPassword;
                                                        user.save().then((saved) => {
                                                            console.log(saved)
                                                            res.json({ "message": "Password Updated" })
                                                        })
                                                            .catch((err) => next(err))
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
                                        res.json({ "message": "Token Expired" });
                                    }
                                }
                                else {
                                    res.statusCode = 403;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ "message": "Token not found" });
                                }
                            }
                            else {
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ "message": "User not found" });
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
            res.json({ "message": "Missing Fields" });
        }
    })

module.exports = changePassword