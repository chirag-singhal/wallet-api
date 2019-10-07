const express = require('express');
const bodyParser = require('body-parser');

const AuctionVendor = require('../models/auctionVendor');
const User = require('../models/users');

const calculateResults = express.Router();

calculateResults.route('/')
.post((req, res, next) => {
    AuctionVendor.findById(req.user._id).then(async (auctionVendor) => {
        for(let j = 0; j < auctionVendor.auctions.length; j++) {
            if(auctionVendor.auctions[j].auctionId == req.body.auctionId) {
                auctionVendor.auctions[j].results = true;
                User.findById(auction.winner).then(async (user) => {
                    for(let i = 0; i < user.bids.length; i++) {
                        if(user.bids[i].auctionId == req.body.auctionId){
                            user.bids[i].winner = true;
                            break;
                        }
                    }
                    await user.save();
                })
            }
        }
        await auctionVendor.save();
        res.end();
    })
})

module.exports = calculateResults
