const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/auctionVendor');

const getAuctionVendor = express.Router();
getAuctionVendor.use(bodyParser.json());

getAuctionVendor.route('/')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "orders": req.user.orders,
            "auctions": req.user.auctions
        })
    })

module.exports = getAuctionVendor;