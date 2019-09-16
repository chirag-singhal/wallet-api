const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/delivery');

const getDeliverProducts = express.Router();
getDeliverProducts.use(bodyParser.json());

getDeliverProducts.route('/')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "orders": req.user.orders,
            "auctionOrders": req.user.auctionOrders
        })
    })

module.exports = getDeliverProducts;