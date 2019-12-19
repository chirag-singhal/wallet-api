const express = require('express');
const bodyParser = require('body-parser');

const EventOwner = require('../models/auctionVendor')

const addAuctionVendor = express.Router();
addAuctionVendor.use(bodyParser.json());

addAuctionVendor.route('/')
.post((req, res, next) => {
    EventOwner.create(req.body)
    .then((eventOwner) => {
            console.log(eventOwner, "EVENT VENDOR")
            res.statusCode = 200;
            res.json({"message": "Event Vendor Created"})
        }).catch((err) => {
              console.log(err)
                res.statusCode = 403;
                res.json(err);
    })
})

module.exports = addAuctionVendor