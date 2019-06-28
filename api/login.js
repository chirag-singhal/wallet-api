const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const sendOtp = require('./sendOtp')

const Users = require('../models/users')
const Otp = require('../models/otp')

const config = require('../config')

const auth = express.Router();

auth.use(bodyParser.json());


auth.route('/login').get((req, res, next) => {
    if(req.body.contact && req.body.password){
        Users.findOne({contact: req.body.contact}).exec()
        .then((user) => {
            if(user == null) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end("User not exits");
            } else if(!user.verified) {
                sendOtp(user.contact, user.countrycode, (result) =>{
                    if(result){
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("OTP has been send!! User is not verified")
                    } else {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("Something went wrong")
                    }
                })

            } else {
                bcrypt.compare(req.body.password, user.password)
                .then(async (result) => {
                    if(result == true){
                        const token = jwt.sign({email: user.email}, config.secret);

                        user.tokens = user.tokens.concat({ token });
                        await Users.findByIdAndUpdate(user._id, {
                            $push: {
                                'tokens': {
                                    token
                                }
                            }
                        });
                        console.log(user);

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');

                        res.json({
                            success: true,
                            message: 'Authentication successful!',
                            token: token,
                            user: user
                        });
                    }
                    else{
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("Incorrect Password");
                    }
                })
                .catch((err) => next(err));
            }
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(err);})
    } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end("Missing Fields");
    }
});

auth.route('/signup').post((req, res, next) => {
    if (req.body.email && req.body.username && req.body.password && req.body.countrycode && req.body.contact) {

        Users.findOne({email: req.body.email}).exec().then((user) => {
            if(user != null && !user.verified){
                console.log(user, "Not verified")
                user.username = req.body.username
                user.contact = req.body.contact
                user.countrycode = req.body.countrycode
                user.email = req.body.username
                bcrypt.hash(req.body.password, 10)
                    .then((hashedPassword) => {
                        console.log(hashedPassword)
                        user.password = hashedPassword;
                    })
                    .catch((err) => next(err))
                    user.save()
                    .then(() => {
                        console.log("saved")
                        sendOtp(user.contact, user.countrycode, (result) =>{
                            if(result){
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(user)
                            } else {
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.end("Something went wrong")
                            }
                        })
                    })
                    .catch((err) => next(err))
            }
            else if(user != null) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end("User already exits");
            } else {
                Users.findOne({username: req.body.username}).exec().then((user) => {
                    if(user != null && !user.verified){
                        user.username = req.body.username
                        user.contact = req.body.contact
                        user.countrycode = req.body.countrycode
                        user.email = req.body.username
                        bcrypt.hash(req.body.password, 10)
                            .then((hashedPassword) => {
                                user.password = hashedPassword;
                            })
                            .catch((err) => next(err))
                        user.save()
                        .then(() => {
                            sendOtp(user.contact, user.countrycode, (result) =>{
                                if(result){
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(user)                                    
                                } else {
                                    res.statusCode = 403;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end("Something went wrong")
                                }
                            })
                        })
                        .catch((err) => next(err))
                    }
                    else if(user != null) {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("User already exits");
                    } else {
                        Users.findOne({contact: req.body.contact}).exec().then((user) => {
                            if(user != null && !user.verified){
                                user.username = req.body.username
                                user.contact = req.body.contact
                                user.countrycode = req.body.countrycode
                                user.email = req.body.username
                                bcrypt.hash(req.body.password, 10)
                                    .then((hashedPassword) => {
                                        user.password = hashedPassword;
                                    })
                                    .catch((err) => next(err))
                                    user.save()
                                    .then(() => {
                                        sendOtp(user.contact, user.countrycode, (result) =>{
                                            if(result){
                                                res.statusCode = 200;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.json(user)                                                
                                            } else {
                                                res.statusCode = 403;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.end("Something went wrong")
                                            }
                                        })
                                    })
                                    .catch((err) => next(err))
                            }
                            else if(user != null){
                                console.log(user);
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.end("User already exits");
                            } else {
                                const otp = Math.floor(100000 + Math.random() * 900000)
                                const sender = 'ikcdel';
                                const authkey = '10703APwDdCpscSPz5c43753d';
                                const body = `Your otp to register in IKC is :  ${otp}`;
                                const url = `https://sms.spada.in/api/sendhttp.php?authkey=${authkey}&mobiles=${req.body.contact},${req.body.countrycode}${req.body.contact}&message=${body}&sender=${sender}&route=4&response=json`;
                                https.get(url,{rejectUnauthorized:false}, (resp) => {
                                    let data = '';
                                    resp.on('data', (chunk) => {
                                        data += chunk;
                                            Otp.create({
                                                "contact": req.body.contact,
                                                "otp": otp
                                            }).then(() => {
                                                const token = jwt.sign({email: req.body.email}, config.secret);
                                                Users.create({
                                                    ...req.body,
                                                    tokens: [
                                                        { token }
                                                    ]
                                                }).then((user) => {
                                                    console.log(user);
                                                    res.statusCode = 200;
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.json(user);
                                                })
                                            }).catch((err) => next(err))
                                    });

                                    resp.on('end', () => {
                                        console.log(JSON.parse(data));
                                    });
                                }).on("error", (err) => {
                                    console.log("Error: " + err.message);
                                    next(err);
                                });
                            }
                        });
                    }
                }).catch((err) => next(err));
  
            }
        }).catch((err) => {
            console.log(err);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(err);
        });
    } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end("Missing Fields");
    }
});

    module.exports = auth;

