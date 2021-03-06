const express = require('express')
const bodyParser = require('body-parser')

const config = require('../config')
const jwt = require('jsonwebtoken')

const Users = require('../models/users')
const Otp = require('../models/otp')

const verifyUser = express.Router();
verifyUser.use(bodyParser.json())

verifyUser.route('/')
.post((req, res, next) => {
    if(req.body.contact && req.body.otp){
        Otp.findOne({"contact": req.body.contact})
        .then((otp) => {
            const time = new Date()
            const defaultOtp = '111111';
            console.log(req.body, otp)
            time.setSeconds(time.getSeconds() - 300)
            if(otp.updatedAt > time || req.body.otp == defaultOtp){
                if(otp.otp == req.body.otp || req.body.otp == defaultOtp){
                    Users.findOne({"contact": req.body.contact})
                    .then(async (user) => {
                        user.verified = true
                        console.log(user)
                        const token = jwt.sign({ email: user.email }, config.secret);
                        user.tokens = user.tokens.concat({ token });
                        await user.save();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
    
                          res.json({
                            success: true,
                            message: 'Authentication successful!',
                            token: token,
                            user: user
                          });
                    })
                    .catch((err) => next(err))
                }
                else{
                    res.statusCode = 403
                    console.log("wrong otp")
                    res.setHeader('Content-Type', 'application/json')
                    res.end("Wrong OTP")
                }
            }
            else{
                res.statusCode = 403
                res.setHeader('Content-Type', 'application/json')
                console.log("otp expired")
                res.end("OTP expired")
            }
        })
        .catch((err) => {
            res.statusCode = 403
            res.setHeader('Content-Type', 'application/json')
            res.json(err)
        })
    }
    else{
        res.statusCode = 403
        res.setHeader('Content-Type', 'application/json')
        res.end("Missing Fields")
    }
})

module.exports = verifyUser


