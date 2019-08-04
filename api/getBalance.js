const express = require('express')
const bodyParser = require('body-parser')

const Users = require('../models/users')

const balance = express.Router()
balance.use(bodyParser.json())

const apiKey = 'dnjskfnjksj32i@32opo'

balance.route('/')
.get((req, res, next) => {
    if(req.query.key == apiKey){
        Users.findOne({contact: req.body.contact}).exec()
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
    }
    else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({message: "Wrong key"});
    }
})

module.exports = balance