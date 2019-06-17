const express = require('express')
const bodyParser = require('body-parser')

const Users = require('../model/users')
const resetPassword = require('../model/resetPassword')
const sendOtp = require('./sendOtp')

const forgotPassword = express.Router()

forgotPassword.use(bodyParser.json())

forgotPassword.route('/')
.get((req, res, next) => {
    if(req.body.contact && req.body.countrycode){
        Users.findOne({contact: req.contact}).exec()
        .then((user) => {
            const token = crypto.randomBytes(32).toString('hex')

            if(user != null){
                console.log(user)
                resetPassword.findOne({contact: req.contact}).exec()
                .then((reset) => {
                    if(reset != null){
                        reset.token = token
                        resetPassword.save()
                    }
                    else{
                        resetPassword.create({
                            "contact": req.body.contact,
                            "token": token
                        })
                    }
                })
                if(sendOtp(req.contact, req.countrycode)){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: true,
                        token: token,
                        messgae: "OTP has been send"
                    });
                }
                else{
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.end("Something went wrong");
                }
            }
            else{
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end("User Not Found");
            }
        })
        .catch((err) => {
            console,log(err);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(err);
        })
    }
    else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end("Missing Fields");
    }
})

module.exports = forgotPassword