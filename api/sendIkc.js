const User = require('../models/users');
const shortid = require('shortid');
const express = require('express')
const bodyParser = require('body-parser')
const Vendors = require('../models/eventOwner');
const sendIkc = express.Router();
const admin = require('firebase-admin');
const db = require('../firestore')
sendIkc.use(bodyParser.json())
sendIkc.route('/')
    .post((req, res, next) => {

        User.findById(req.user._id).then((user) => {
            if (user != null && user.amount > req.body.amount) {
                console.log(user.amount)
                User.findByIdAndUpdate(req.user._id, {
                    $inc: { amount: -req.body.amount }
                }).then((saved) => {
                    User.findOne({ qrCode: req.body.qrCode }).then((user) => {

                        if (user) {
                            User.findOneAndUpdate({ qrCode: req.body.qrCode }, {
                                $inc: { amount: +req.body.amount }
                            }).then(async() => {
                                await db.collection('users').doc(''+req.user.contact).set({
                                    transactions: admin.firestore.FieldValue.arrayUnion({
                                        transactionId: shortid.generate(),
                                        amount: -req.body.amount,
                                        transactionStatus: 'TXN_SUCCESS',
                                        name: user.username,
                                        contact: user.contact,
                                        paymentType: 'ikc',
                                        detail: "Sent to " + req.body.qrCode,
                                        time: Date.now()
                                    }),
                                    amount: req.user.amount - req.body.amount
                                })
                                User.findByIdAndUpdate(req.user._id, {
                                    $push: {
                                        transactions: {
                                            transactionId: shortid.generate(),
                                            amount: -req.body.amount,
                                            transactionStatus: 'TXN_SUCCESS',
                                            name: user.username,
                                            contact: user.contact,
                                            paymentType: 'ikc',
                                            detail: "Sent to " + req.body.qrCode,
                                            time: Date.now()
                                        }
                                    }
                                }).then(async() => {
                                    await db.collection('users').doc(''+user.contact).set({
                                        transactions: admin.firestore.FieldValue.arrayUnion({
                                            transactionId: shortid.generate(),
                                            amount: +req.body.amount,
                                            transactionStatus: 'TXN_SUCCESS',
                                            name: req.user.username,
                                            contact: req.user.contact,
                                            paymentType: 'ikc',
                                            detail: "Received from " + req.user.contact,
                                            time: Date.now()
                                        }),
                                        amount: user.amount + req.body.amount
                                    })
                                    User.findOneAndUpdate({ qrCode: req.body.qrCode }, {
                                        $push: {
                                            transactions: {
                                                transactionId: shortid.generate(),
                                                amount: +req.body.amount,
                                                transactionStatus: 'TXN_SUCCESS',
                                                name: req.user.username,
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
                        else {
                            console.log('vendor')
                            console.log(req.body.qrCode)
                            Vendors.findOne({ qrCode: req.body.qrCode }).then((vendor) => {
                                console.log(vendor)
                                Vendors.findOneAndUpdate({ qrCode: req.body.qrCode }, {
                                    $inc: { totalEarnings: req.body.amount }
                                }).then(async() => {
                                    console.log(vendor.walletId)
                                    User.findById(vendor.walletId).then((user) => {
                                        console.log(user)
                                    })
                                    await db.collection('users').doc(''+req.user.contact).set({
                                        transactions: admin.firestore.FieldValue.arrayUnion({
                                            transactionId: shortid.generate(),
                                            amount: -req.body.amount,
                                            transactionStatus: 'TXN_SUCCESS',
                                            name: user.username,
                                            contact: user.contact,
                                            paymentType: 'ikc',
                                            detail: "Sent to " + req.body.qrCode,
                                            time: Date.now()
                                        }),
                                        amount: req.user.amount - req.body.amount
                                    })
                                    User.findByIdAndUpdate(req.user._id, {
                                        $push: {
                                            transactions: {
                                                transactionId: shortid.generate(),
                                                amount: -req.body.amount,
                                                transactionStatus: 'TXN_SUCCESS',
                                                name: user.username,
                                                contact: user.contact,
                                                paymentType: 'ikc',
                                                detail: "Sent to " + req.body.qrCode,
                                                time: Date.now()
                                            }
                                        }
                                    }).then(async () => {
                                        await db.collection('users').doc(''+user.contact).set({
                                            transactions: admin.firestore.FieldValue.arrayUnion({
                                                transactionId: shortid.generate(),
                                                amount: +req.body.amount,
                                                transactionStatus: 'TXN_SUCCESS',
                                                name: req.user.username,
                                                contact: req.user.contact,
                                                paymentType: 'ikc',
                                                detail: "Received from " + req.user.contact,
                                                time: Date.now()
                                            }),
                                            amount: user.amount + req.body.amount
                                        })
                                        User.findByIdAndUpdate(vendor.walletId, {
                                            $push: {
                                                transactions: {
                                                    transactionId: shortid.generate(),
                                                    amount: +req.body.amount,
                                                    transactionStatus: 'TXN_SUCCESS',
                                                    name: req.user.username,
                                                    contact: req.user.contact,
                                                    paymentType: 'ikc',
                                                    detail: "Received from " + req.user.contact,
                                                    time: Date.now()
                                                }
                                            }
                                        }).then(() => {
                                            User.findByIdAndUpdate(vendor.walletId, {
                                                $inc: { amount: req.body.amount }
                                            }).then((user) => {
                                                console.log(user);
                                                res.statusCode = 200;
                                                res.json({ "message": "ikc successfully transferred!" })
                                            }).catch((err) => next(err))
                                        }).catch((err) => next(err))
                                    }).catch((err) => next(err))
                                }).catch((err) => next(err))
                            });
                        }
                    }).catch((err) => {
                        res.statusCode = 403;
                        res.json(err);
                    })
                })
                    .catch((err) => next(err))
            }
            else {
                res.statusCode = 403;
                res.send({ "message": 'Insufficient Balance' })
                res.end();
            }
        }).catch((err) => next(err))


    })

module.exports = sendIkc