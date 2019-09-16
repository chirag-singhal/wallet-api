const mongoose = require('mongoose');


const BidSchema = new mongoose.Schema({
    bidAmount: {
        type: Number
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
    imageUrl: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    bid: {
        type: [BidSchema]
    },
    auctionCreator: {
        type: mongoose.Schema.Types.ObjectId
    },
    winner: {
        winner: mongoose.Schema.Types.ObjectId,
        bidAmount: Number
    }
});

const AuctionProduct = mongoose.model('AuctionProduct', AuctionProductSchema);

// const auctionProduct = new AuctionProduct({
//     title: "Sunil Chhetri's Soccer Cleat",
//     price: 15000,
//     quantity: 1,
//     numberOfBids: 0,
//     description: "This is an auction product.",
//     duration: "13-Apr-2019 To 13-Jun-2019",
//     imageUrl: "../images/shoes1.jpg"
// });
// auctionProduct.save().then(() => {
//     console.log(auctionProduct);
// }).catch((e) => {
//     console.log(e);
// });

module.exports = AuctionProduct;