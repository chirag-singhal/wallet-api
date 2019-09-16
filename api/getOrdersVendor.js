const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/ShopVendor');

const getOrdersVendor = express.Router();
getOrdersVendor.use(bodyParser.json());

getOrdersVendor.route('/')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "orders": req.user.orders
        })
    })

module.exports = getOrdersVendor;