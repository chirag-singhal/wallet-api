const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')


const User = require('../models/users')

const admin = require('firebase-admin');

const rechargePending = express.Router();
const db = require('../firestore')

rechargePending.use(bodyParser.json());

rechargePending.route('/')
    .get(async (req, res, next) => {
        let amount;
        const userId = req.query.client_id
        const refCode = req.query.operator_id
        const status = req.query.status
        User.findById(userId).then(async (user) => {
            if (user != null) {
                for (transaction of user.transactions)
                    if (transaction.transactionId == refCode)
                        amount = transaction.amount;

                if (status === 'success') {
                    await db.collection('users').doc(''+req.user.contact).set({
                        transactions: admin.firestore.FieldValue.arrayUnion({
                            transactionId: refCode,
                            amount: -amount,
                            transactionStatus: 'TXN_SUCCESS',
                            name: 'RECHARGE',
                            contact: user.contact,
                            paymentType: 'ikc',
                            detail: "Recharged ",
                            time: Date.now()
                        }),
                        amount: user.amount
                    })
                    User.findByIdAndUpdate(userId, {
                        $push: {
                            transactions: {
                                transactionId: refCode,
                                amount: -amount,
                                transactionStatus: 'TXN_SUCCESS',
                                name: 'RECHARGE',
                                contact: user.contact,
                                paymentType: 'ikc',
                                detail: "Recharged ",
                                time: Date.now()
                            }
                        }
                    })
                        .then(() => {
                            res.statusCode = 200;
                            res.json({ "message": "Recharge Successfull" });
                        })
                        .catch((err) => next(err))

                } else if (status === 'failure') {
                    User.findByIdAndUpdate(userId, {
                        $inc: {
                            amount: +amount
                        }
                    })
                        .then(async() => {
                            await db.collection('users').doc(''+user.contact).set({
                                transactions: admin.firestore.FieldValue.arrayUnion({
                                    transactionId: refCode,
                                    amount: amount,
                                    name: 'REFUND',
                                    contact: user.contact,
                                    transactionStatus: 'TXN_SUCCESS',
                                    paymentType: 'ikc',
                                    detail: "Refund for Recharge ",
                                    time: Date.now()
                                }),
                                amount: user.amount + amount
                            })
                            User.findByIdAndUpdate(userId, {
                                $push: {
                                    transactions: {
                                        transactionId: refCode,
                                        amount: amount,
                                        name: 'REFUND',
                                        contact: user.contact,
                                        transactionStatus: 'TXN_SUCCESS',
                                        paymentType: 'ikc',
                                        detail: "Refund for Recharge ",
                                        time: Date.now()
                                    }
                                }
                            })
                                .then(() => {
                                    res.statusCode = 403;
                                    res.json({ "message": "Recharge Unsuccessfull" });
                                })
                                .catch((err) => next(err))
                        })
                        .catch((err) => {
                            res.statusCode = 403
                            res.json(err);
                        })
                }
            }
            else {
                res.statusCode = 403;
                res.json({ "message": "User not found" });
            }
        })

    })

module.exports = rechargePending