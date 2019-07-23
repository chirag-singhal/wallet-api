const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')


const User = require('../models/users')


const rechargePending = express.Router();

rechargePending.use(bodyParser.json());

rechargePending.route('/')
.get((req, res, next) => {
    const userId = req.query.client_id
    const refCode = req.query.operator_id
    const status = req.query.status

    if(resp.status === 'success') {
        User.findByIdAndUpdate(req.user._id, {
            $push: {
                transactions: {
                    transactionId: resp.operator_ref,
                    amount: req.body.amount,
                    transactionStatus: 'TXN_SUCCESS',
                    paymentType: 'ikc',
                    detail: "Recharged " + req.body.amount +' ' + req.body.number,
                    time: Date.now()
                }
            }
        })
        .then(() => {
            res.statusCode = 200;
            res.json({"message": "Recharge Successfull"});
        })
        .catch((err) => next(err))
        
    } else if(resp.status === 'failure') {
        User.findByIdAndUpdate(req.user._id, {
            $inc: {
                amount: +req.body.amount
            }
        })
        .then(() => {
            User.findByIdAndUpdate(req.user._id, {
                $push: {
                    transactions: {
                        transactionId: resp.operator_ref,
                        amount: req.body.amount,
                        transactionStatus: 'TXN_FAILURE',
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

})

module.exports = rechargePending