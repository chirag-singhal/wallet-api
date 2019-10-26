const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const shortid = require('shortid');

const accountSid = 'ACe92d7e192048506640fc843f6b77e1bf'; // Your Account SID from www.twilio.com/console
const authToken = '1d68ddf556166ccc1a0e18c3d0482dc0';   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const sendOtp = require('./sendOtp')

const Users = require('../models/users')
const Otp = require('../models/otp');


const validOptions = { apikey: '+CkeFIiyN/I-rrs1uRIH6XBJUxEYiSSiu14KuTHcns' };
const tl = require('textlocal')(validOptions);

const config = require('../config')
const db = require('../firestore')
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
    console.log(req.body)
    if (req.body.email && req.body.username && req.body.password && req.body.countrycode && req.body.contact) {
        const user3 = await Users.findOne({ email: req.body.email });
        const user2 = null;
        const user1 = await Users.findOne({ contact: req.body.contact });
        console.log(user1, "1");
        console.log(user2, "2");
        console.log(user3, "3");
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
                            })
                            .catch((err) => next(err))

                    }
                    else if (user2 != null) {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ "message": "User already exits" });
                    } else {
                        console.log(user1)
                        Users.findOne({ contact: req.body.contact }).then(async() => {
                            if (user3 != null && !user3.verified) {
                                console.log("same contact")
                                user3.username = req.body.username
                                user3.contact = req.body.contact
                                user3.countrycode = req.body.countrycode
                                user3.email = req.body.email
                                bcrypt.hash(req.body.password, 10)
                                    .then((hashedPassword) => {
                                        user3.password = hashedPassword;
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
                                    })
                                    .catch((err) => next(err))

                            }
                            else if (user3 != null) {
                                console.log(user3);
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ "message": "User already exits" });
                            } else {
                                await db(req.body.contact, {}, 0);
                                const otp = Math.floor(100000 + Math.random() * 900000)
                                const sender = 'ikcdel';
                                const authkey = '10703APwDdCpscSPz5c43753d';
                                const body = `Your otp to register in IKC is :  ${otp}`;

                                tl.sendSMS(req.body.contact, body, 'IKC-DEAL', function (err, data) {
                                    console.log(data)
                                    if(err) {
                                        next(err);
                                    }
                                });

                                // client.messages.create({
                                //     body: `${body}`,
                                //     to: `+${req.body.countrycode}${req.body.contact}`,  // Text this number
                                //     from: '+12025176881' // From a valid Twilio number
                                // })
                                //     .then((message) => console.log(message.sid));
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
                                        qrCode: shortid.generate(),
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

