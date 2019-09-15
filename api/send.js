const User = require('../models/users');
const shortid = require('shortid');
const express = require('express')
const bodyParser = require('body-parser')
const send = express.Router();
send.use(bodyParser.json())
send.route('/')
    .post((req, res, next) => {

        User.findById(req.user._id).then((user) => {
            if (user != null && user.amount > req.body.amount) {
                console.log(user.amount)
                User.findByIdAndUpdate(req.user._id, {
                    $inc: { amount: -req.body.amount }
                }).then((saved) => {

                })
                    .catch((err) => next(err))
            }
            else {
                throw new Error('Insufficient Balance')
            }
        }).catch((err) => next(err))

        User.findOne({ contact: req.body.to }).then((user) => {

            if (user) {
                User.findOneAndUpdate({ contact: req.body.to }, {
                    $inc: { amount: +req.body.amount }
                }).then(() => {
                    User.findByIdAndUpdate(req.user._id, {
                        $push: {
                            transactions: {
                                transactionId: shortid.generate(),
                                amount: -req.body.amount,
                                transactionStatus: 'TXN_SUCCESS',
                                name: user.name,
                                contact: user.contact,
                                paymentType: 'ikc',
                                detail: "Sent to " + req.body.to,
                                time: Date.now()
                            }
                        }
                    }).then(() => {
                        User.findOneAndUpdate({ contact: req.body.to }, {
                            $push: {
                                transactions: {
                                    transactionId: shortid.generate(),
                                    amount: +req.body.amount,
                                    transactionStatus: 'TXN_SUCCESS',
                                    name: req.user.name,
                                    contact: req.user.contact,
                                    paymentType: 'ikc',
                                    detail: "Received from " + req.user.contact,
                                    time: Date.now()
                                }
                            }
                        }).then(() => {
                            console.log('saved')
                            res.statusCode = 200;
                            res.json({ "message": "ikc successfully transferred!" })
                        }).catch((err) => next(err))
                    }).catch((err) => next(err))
                }).catch((err) => next(err))

            }
        }).catch((err) => {
            res.statusCode = 403;
            res.json(err);
        })
    })

module.exports = send