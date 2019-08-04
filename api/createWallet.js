const express = require('express')
const bodyParser = require('body-parser')

const wallet = express.Router()
const Users = require('../models/users')
wallet.use(bodyParser.json())

wallet.route('/')
.post((req, res, next) => {
    Users.findOne({email: req.body.email}).exec().then((user) => {
        if(user != null && !user.verified){
            console.log(user, "Not verified")
            user.username = req.body.username
            user.contact = req.body.contact
            user.countrycode = req.body.countrycode
            user.email = req.body.username
            user.verified = true
            bcrypt.hash(req.body.password, 10)
                .then((hashedPassword) => {
                    console.log(hashedPassword)
                    user.password = hashedPassword;
                })
                .catch((err) => next(err))
                user.save()
                .then(() => {
                    console.log("saved")
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({"message": "wallet  created"})
                })
                .catch((err) => next(err))
        }
        else if(user != null) {
            user.username = req.body.username
            user.contact = req.body.contact
            user.countrycode = req.body.countrycode
            user.verified = true
            user.email = req.body.username
            bcrypt.hash(req.body.password, 10)
                .then((hashedPassword) => {
                    user.password = hashedPassword;
                })
                .catch((err) => next(err))
                user.save()
                .then(() => {
                    console.log("saved")
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({"message": "wallet  created"})
                })
                .catch((err) => next(err))
        } else {
                    Users.findOne({contact: req.body.contact}).exec().then((user) => {
                        if(user != null && !user.verified){
                            user.username = req.body.username
                            user.contact = req.body.contact
                            user.countrycode = req.body.countrycode
                            user.verified = true
                            user.email = req.body.username
                            bcrypt.hash(req.body.password, 10)
                                .then((hashedPassword) => {
                                    user.password = hashedPassword;
                                })
                                .catch((err) => next(err))
                                user.save()
                                .then(() => {
                                    console.log("saved")
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({"message": "wallet  created"})
                                })
                                .catch((err) => next(err))
                        }
                        else if(user != null){
                            user.username = req.body.username
                            user.contact = req.body.contact
                            user.countrycode = req.body.countrycode
                            user.verified = true
                            user.email = req.body.username
                            bcrypt.hash(req.body.password, 10)
                                .then((hashedPassword) => {
                                    user.password = hashedPassword;
                                })
                                .catch((err) => next(err))
                                user.save()
                                .then(() => {
                                    console.log("saved")
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({"message": "wallet  created"})
                                })
                                .catch((err) => next(err))
                        } else {                            
                                Users.create({
                                    ...req.body,
                                    verified: true
                                }).then((user) => {
                                    console.log(user);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(user);
                                })
                        }
                    });
        }
    }).catch((err) => {
        console.log(err);
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(err);
    });
})