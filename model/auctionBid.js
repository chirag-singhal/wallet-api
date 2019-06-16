const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
    bidAmount: {
        type: Number
    },
    bidRemark: {
        type: String
    }
});

const AuctionBidSchema = new mongoose.Schema({
    productId: {
        type: String
    },
    bid: {
        type: [BidSchema]
    }
});

const AuctionBid = mongoose.model('AuctionBid', AuctionBid);

module.exports = AuctionBid;