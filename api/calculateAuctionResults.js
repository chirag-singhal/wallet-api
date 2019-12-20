const express = require('express');
const bodyParser = require('body-parser');

const AuctionVendor = require('../models/auctionVendor');
const User = require('../models/users');
const AuctionProduct = require('../models/auctionProducts');

const calculateResults = express.Router();

calculateResults.route('/')
    .post((req, res, next) => {
        AuctionVendor.findById(req.user._id).then(async (auctionVendor) => {
            for (let j = 0; j < auctionVendor.auctions.length; j++) {
                if (auctionVendor.auctions[j].auctionId == req.body.auctionId) {
                    if (auctionVendor.auctions[j].results) {
                        res.statusCode = 403;
                        res.json({
                            "message": "Result already calculated"
                        });
                        res.end();
                    } else {
                        auctionVendor.auctions[j].results = true;
                        for (let i = 0; i < auctionVendor.auctions[j].bid.length; i++) {
                            User.findById(auctionVendor.auctions[j].bid[i].userId).then(async (user) => {
                                for (let i = 0; i < user.bids.length; i++) {
                                    if (user.bids[i].auctionId == req.body.auctionId) {
                                        user.bids[i].winner = "lost";
                                        break;
                                    }
                                }
                                await user.save();
                            })
                        }
                        User.findById(auctionVendor.auctions[j].winner.winner).then(async (user) => {
                            for (let i = 0; i < user.bids.length; i++) {
                                if (user.bids[i].auctionId == req.body.auctionId) {
                                    user.bids[i].winner = "won";
                                    break;
                                }
                            }
                            await user.save();
                        })
                    }
                }
            }
            await AuctionProduct.deleteOne({'_id': req.body.auctionId});
            await auctionVendor.save();
            res.end();
        })
    })

module.exports = calculateResults