const mongoose = require('mongoose');

const Product = new mongoose.Schema({
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
    }
});

const AuctionProduct = mongoose.model('AuctionProduct', Product);

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