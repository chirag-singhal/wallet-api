const express = require('express')
const bodyParser = require('body-parser')

const wallet = express.Router()
const Users = require('../models/users')
wallet.use(bodyParser.json())
const bcrypt = require('bcrypt');

wallet.route('/')
.post((req, res, next) => {
    Users.findOne({email: req.body.email}).exec().then((user) => {
        if(user != null && !user.verified){
            console.log(user, "Not verified")
            user.contact = req.body.contact
            user.countrycode = req.body.countrycode
            user.verified = false
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
            user.contact = req.body.contact
            user.countrycode = req.body.countrycode
            user.verified = true
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
                            user.contact = req.body.contact
                            user.countrycode = req.body.countrycode
                            user.verified = true
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
                            user.contact = req.body.contact
                            user.countrycode = req.body.countrycode
                            user.verified = true
                                user.save()
                                .then(() => {
                                    console.log("saved")
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({"message": "wallet  created"})
                                })
                                .catch((err) => next(err))
                        } else {    
                                console.log("mo user found")                        
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

module.exports = wallet