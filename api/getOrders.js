const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');

const getOrders = express.Router();
getOrders.use(bodyParser.json());

getOrders.route('/')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "orders": req.user.orders,
            "auctionOrders": req.user.auctionOrders
        })
    })

module.exports = getOrders;