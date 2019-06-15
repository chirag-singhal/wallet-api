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

const auctionProduct = mongoose.model('AuctionProduct', Product);

module.exports = auctionProduct;