const AuctionProduct = require('../models/auctionProducts');

const getAuctionProducts = (req, res) => {
    AuctionProduct.find( {} ).then((AuctionProducts) => {
        res.send(AuctionProducts);
    }).catch((e) => {
        res.status(500).send(e);
    });
}

module.exports = getAuctionProducts;