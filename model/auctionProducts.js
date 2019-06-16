const mongoose = require('mongoose');


const BidSchema = new mongoose.Schema({
    bidAmount: {
        type: Number
    },
    bidRemark: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

const AuctionProductSchema = new mongoose.Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    quantity: {
        type: Number
    },
    numberOfBids: {
        type: Number
    },
    duration: {
        type: String
    },
    bid: {
        type: [BidSchema]
    }
});

const AuctionProduct = mongoose.model('AuctionProduct', AuctionProductSchema);

// const auctionProduct = new AuctionProduct({
//     title: "Sunil Chhetri's Soccer Cleat",
//     price: 15000,
//     quantity: 1,
//     numberOfBids: 2,
//     description: "This is an auction product.",
//     duration: "13-Apr-2019 To 13-Jun-2019"
// });
// auctionProduct.save().then(() => {
//     console.log(auctionProduct);
// }).catch((e) => {
//     console.log(e);
// });

module.exports = AuctionProduct;