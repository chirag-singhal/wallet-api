const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const Users = require('../models/ShopVendor')

const config = require('../config')

const loginShopVendor = express.Router();

loginShopVendor.use(bodyParser.json());

loginShopVendor.route('/').
post(async (req, res, next) => {
    if(req.body.contact && req.body.password) {
        const user = await Users.findOne({"contact": req.body.contact});
        Users.findOne({"contact": req.body.contact}).then((user2) => {
            console.log(user, user2, "NOT FOUND OR FOUND")
            if(user == null) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end("User not exits");
            } else {
                bcrypt.compare(req.body.password, user.password)
                .then(async (result) => {
                    if(result == true){
                        const token = jwt.sign({contact: user.contact}, config.secret);

                        user.tokens = user.tokens.concat({ token });
                        Users.findByIdAndUpdate(user._id, {
                            $push: {
                                'tokens': {
                                    token
                                }
                            }
                        }).then((user) => {
                            console.log(user);

                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');

                            res.json({
                                success: true,
                                message: 'Authentication successful!',
                                token: token
                            });
                        }).catch((err) => next(err))
                        
                    }
                    else{
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({"message": "Incorrect Password"});
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
        res.json({"message": "Missing Fields"});
    }
});

module.exports = loginShopVendor;

