const express = require('express')
const bodyParser = require('body-parser')

const Users = require('../models/users')

const transactions = express.Router()
transactions.use(bodyParser.json())

transactions.route('/')
.get((req, res, next) => {
    Users.findById(req.user._id)
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            amount: user.amount,
            transactions: user.transactions
        });
    })
    .catch((err) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json(err);
    })
})