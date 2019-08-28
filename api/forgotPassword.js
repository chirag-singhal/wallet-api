const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const Users = require('../models/users')
const resetPassword = require('../models/resetPassword')
const sendOtp = require('./sendOtp')

const forgotPassword = express.Router()

forgotPassword.use(bodyParser.json())

forgotPassword.route('/')
    .post((req, res, next) => {
        if (req.body.contact && req.body.countrycode) {
            Users.findOne({ contact: req.body.contact })
                .then((user) => {
                    const token = crypto.randomBytes(32).toString('hex')
                    if (user != null && user.verified) {
                        console.log(user)
                        resetPassword.findOne({ contact: req.body.contact })
                            .then((reset) => {
                                if (reset != null) {
                                    reset.token = token
                                    reset.save().then(() => {

                                    })
                                    .catch((err) => {
                                        res.statusCode = 403
                                        res.json(err)
                                    })
                                }
                                else {
                                    resetPassword.create({
                                        "contact": req.body.contact,
                                        "token": token
                                    })
                                }
                            })
                        sendOtp(req.body.contact, req.body.countrycode, (result) => {
                            if (result) {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({
                                    success: true,
                                    token: token,
                                    messgae: "OTP has been send"
                                });
                            }
                            else {
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ "messgae": "Something went wrong" });
                            }
                        })
                    }
                    else {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ "messgae": "User Not Found" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(err);
                })
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({ "messgae": "Missing Fields" });
        }
    })

module.exports = forgotPassword