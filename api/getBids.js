const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');

const getBids = express.Router();
getBids.use(bodyParser.json());

getBids.route('/')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "bids": req.user.bids
        })
    })

module.exports = getBids;