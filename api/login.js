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


auth.route('/login').post((req, res, next) => {
    if (req.body.contact && req.body.password) {
        Users.findOne({ contact: req.body.contact })
            .then((user) => {
                if (user == null) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ "message": "User not exits" });
                } else if (!user.verified) {
                    sendOtp(user.contact, user.countrycode, (result) => {
                        if (result) {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ "message": "OTP has been send!! User is not verified" })
                        } else {
                            res.statusCode = 403;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ "message": "Something went wrong" });
                        }
                    })

                } else {
                    bcrypt.compare(req.body.password, user.password)
                        .then(async (result) => {
                            if (result == true) {
                                const token = jwt.sign({ email: user.email }, config.secret);

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
                                    token: token
                                });
                            }
                            else {
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ "message": "Incorrect Password" });
                            }
                        })
                        .catch((err) => next(err));
                }
            })
            .catch((err) => {
                console.log(err);
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json(err);
            })
    } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({ "message": "Missing Fields" });
    }
});

auth.route('/signup').post(async (req, res, next) => {
    if (req.body.email && req.body.username && req.body.password && req.body.countrycode && req.body.contact) {
        const user1 = await Users.findOne({ email: req.body.email });
        const user2 = await Users.findOne({ username: req.body.username });
        const user3 = await Users.findOne({ contact: req.body.contact });
        console.log(user1);
        console.log(user2);
        console.log(user3);
        Users.findOne({ email: req.body.email }).then(async () => {
            if (user1 != null && !user1.verified) {
                console.log(user1, "Not verified")
                user1.username = req.body.username
                user1.contact = req.body.contact
                user1.countrycode = req.body.countrycode
                user1.email = req.body.email
                bcrypt.hash(req.body.password, 10)
                    .then((hashedPassword) => {
                        console.log(hashedPassword)
                        user1.password = hashedPassword;
                    })
                    .catch((err) => next(err))
                user1.save()
                    .then(() => {
                        console.log("saved")
                        sendOtp(user1.contact, user1.countrycode, (result) => {
                            if (result) {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(user1)
                            } else {
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ "message": "Something went wrong" });
                            }
                        })
                    })
                    .catch((err) => next(err))
            }
            else if (user1 != null) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({ "message": "User already exits" });
            } else {
                Users.findOne({ username: req.body.username }).then(async () => {
                    if (user2 != null && !user2.verified) {
                        console.log("same username")
                        user2.username = req.body.username
                        user2.contact = req.body.contact
                        user2.countrycode = req.body.countrycode
                        user2.email = req.body.email
                        bcrypt.hash(req.body.password, 10)
                            .then((hashedPassword) => {
                                user2.password = hashedPassword;
                            })
                            .catch((err) => next(err))
                        user2.save()
                            .then(() => {
                                sendOtp(user2.contact, user2.countrycode, (result) => {
                                    if (result) {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(user2)
                                    } else {
                                        res.statusCode = 403;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({ "message": "Something went wrong" });
                                    }
                                })
                            })
                            .catch((err) => next(err))
                    }
                    else if (user2 != null) {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ "message": "User already exits" });
                    } else {
                        console.log(user1)
                        Users.findOne({ contact: req.body.contact }).then(() => {
                            if (user3 != null && !user3.verified) {
                                console.log("same contact")
                                user3.username = req.body.username
                                user3.contact = req.body.contact
                                user3.countrycode = req.body.countrycode
                                user3.email = req.body.email
                                bcrypt.hash(req.body.password, 10)
                                    .then((hashedPassword) => {
                                        user3.password = hashedPassword;
                                    })
                                    .catch((err) => next(err))
                                user3.save()
                                    .then(() => {
                                        sendOtp(user3.contact, user3.countrycode, (result) => {
                                            if (result) {
                                                res.statusCode = 200;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.json(user3)
                                            } else {
                                                res.statusCode = 403;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.json({ "message": "Something went wrong" });
                                            }
                                        })
                                    })
                                    .catch((err) => next(err))
                            }
                            else if (user3 != null) {
                                console.log(user);
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ "message": "User already exits" });
                            } else {
                                const otp = Math.floor(100000 + Math.random() * 900000)
                                const sender = 'ikcdel';
                                const authkey = '10703APwDdCpscSPz5c43753d';
                                const body = `Your otp to register in IKC is :  ${otp}`;
                                const url = `https://sms.spada.in/api/sendhttp.php?authkey=${authkey}&mobiles=${req.body.contact},${req.body.countrycode}${req.body.contact}&message=${body}&sender=${sender}&route=4&response=json`;
                                // https.get(url,{rejectUnauthorized:false}, (resp) => {
                                //     let data = '';
                                //     resp.on('data', (chunk) => {
                                //         data += chunk;
                                console.log(req.body.contact, "CHeck");
                                Otp.create({
                                    "contact": req.body.contact,
                                    "otp": otp
                                }).then(() => {
                                    const token = jwt.sign({ email: req.body.email }, config.secret);
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
                                //     });

                                //     resp.on('end', () => {
                                //         console.log(JSON.parse(data));
                                //     });
                                // }).on("error", (err) => {
                                //     console.log("Error: " + err.message);
                                //     next(err);
                                // });
                            }
                        });
                    }
                }).catch((err) => next(err));

            }
        }).catch((err) => {
            console.log(err);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({ "message": "Something went wrong" });
        });
    } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({ "message": "Missing Fields" });
    }
});

module.exports = auth;

