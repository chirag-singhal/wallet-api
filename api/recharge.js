const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')


const User = require('../models/users')

const api_token = 'y8mRIylfHInNtopxM0ZHuKbCWGlWryTKtPFCvcOe5LVXMJYunXp74eoflPdN'

const recharge = express.Router();

recharge.use(bodyParser.json());

recharge.route('/')
.post((req, res, next) => {
    const url = `https://www.pay2all.in/web-api/paynow?api_token=${api_token}&number=${req.body.number}&provider_id=${req.body.provider_id}&amount=${req.body.amount}&client_id=${req.user._id}`
    https.get(url,{rejectUnauthorized:false}, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });

        if(resp.status === 'success') {
            User.findByIdAndUpdate(req.user._id, {
                $inc: {
                    amount: -req.body.amount
                }
            })
            .then(() => {
                User.findByIdAndUpdate(req.user._id, {
                    $push: {
                        transactions: {
                            transactionId: resp.operator_ref,
                            amount: req.body.amount,
                            transactionStatus: 'TXN_SUCCESS',
                            paymentType: 'ikc',
                            detail: "Refund for Recharge " + req.body.amount +' ' + req.body.number,
                            time: Date.now()
                        }
                    }
                })
                .then(() => {
                    res.statusCode = 200;
                    res.json({"message": "Recharge Successfull"});
                })
                .catch((err) => next(err))
            })
            .catch((err) => {
                res.statusCode = 403
                res.json(err);
            })
        } else if(resp.status === 'failure') {
            User.findByIdAndUpdate(req.user._id, {
                $push: {
                    transactions: {
                        transactionId: resp.operator_ref,
                        amount: req.body.amount,
                        transactionStatus: 'TXN_FAILURE',
                        paymentType: 'ikc',
                        detail: "Recharged " + req.body.amount +' ' + req.body.number,
                        time: Date.now()
                    }
                }
            })
            .then(() => {
                res.statusCode = 403;
                res.json({"message": "Recharge Unsuccessfull"});
            })
            .catch((err) => {
                res.statusCode = 403
                res.json(err);
            })
            
        } else if(resp.status === 'pending') {
            User.findByIdAndUpdate(req.user._id, {
                $inc: {
                    amount: -req.body.amount
                }
            })
            .then(() => {
                User.findByIdAndUpdate(req.user._id, {
                    $push: {
                        transactions: {
                            transactionId: resp.operator_ref,
                            amount: req.body.amount,
                            transactionStatus: 'TXN_PENDING',
                            paymentType: 'ikc',
                            detail: "Refund for Recharge " + req.body.amount +' ' + req.body.number,
                            time: Date.now()
                        }
                    }
                })
                .then(() => {
                    res.statusCode = 403;
                    res.json({"message": "Recharge Unsuccessfull"});
                })
                .catch((err) => next(err))
            })
            .catch((err) => {
                res.statusCode = 403
                res.json(err);
            })
        }

        
        resp.on('end', () => {
            console.log(JSON.parse(data));
        });
    })
    .on("error", (err) => {
        console.log("Error: " + err.message);
        callback(false)
    });
})

module.exports = recharge