const AuctionProduct = require('../models/auctionProducts');
const AuctionVendor = require('../models/auctionVendor');
const User = require('../models/users');

const placeBid = (req, res) => {
    const productId = req.body.productId;
    const bidAmount = req.body.bidAmount;
    // const bidRemark = req.body.bidRemark;
    const userId = req.user._id;
    console.log(userId)
    let placed = false;
    const winner = false;
    AuctionProduct.findById(productId).then((product) => {
        if (!product) {
            return res.status(500).json({
                "message": "Invalid Product Id!"
            });
        }

        return AuctionProduct.findById(req.body.productId)

    }).then((product) => {
        for (bid of product.bid) {
            if (bid.userId == req.user._id) {
                console.log(user)
                placed = true;
                res.json({
                    "message": "Bid already placed!"
                });
                res.end();
            }
        }
        if (!placed) {
            AuctionVendor.findById(product.auctionCreator).then((auctionVendor) => {
                if (product.bid.length == 0) {
                    AuctionProduct.findByIdAndUpdate(productId, {
                        $set: {
                            "winner": {
                                bidAmount,
                                userId
                            }
                        }
                    }).then(() => {
                        for (let i = 0; i < auctionVendor.auctions.length; i++) {
                            if (auctionVendor.auctions[i].auctionId == productId) {
                                const winner = {
                                    "winner": userId,
                                    "bidAmount": bidAmount
                                }
                                auctionVendor.auctions[i].winner = winner;
                                break;
                            }
                        }
                        auctionVendor.save().then((vendor) => {
                            console.log(vendor);
                        })
                    })
                } else if (product.winner.bidAmount < bidAmount) {
                    AuctionProduct.findByIdAndUpdate(productId, {
                        $set: {
                            "winner": {
                                bidAmount,
                                "winner": userId
                            }
                        }
                    }).then(() => {
                        for (let i = 0; i < auctionVendor.auctions.length; i++) {
                            if (auctionVendor.auctions[i].auctionId == productId) {
                                const winner = {
                                    "winner": userId,
                                    "bidAmount": bidAmount
                                }
                                auctionVendor.auctions[i].winner = winner;
                                break;
                            }
                        }
                        auctionVendor.save().then((vendor) => {
                            console.log(vendor);
                        })
                    })
                }
                AuctionVendor.findById(product.auctionCreator).then((auctionVendor) => {
                    for (let i = 0; i < auctionVendor.auctions.length; i++) {
                        if (auctionVendor.auctions[i].auctionId == productId) {
                            auctionVendor.auctions[i].bid.push({
                                "userId": userId,
                                "bidAmount": bidAmount
                            })
                        }
                        break;
                    }
                    auctionVendor.save().then((vendor) => {
                        console.log(vendor);
                    })
                })
                User.findByIdAndUpdate(userId, {
                    $push: {
                        "bids": {
                            "auctionId": productId,
                            "name": product.title,
                            bidAmount,
                            "winner": "On Going"
                        }
                    }
                }).then(() => {
                    console.log("user model bid ")
                    AuctionProduct.findByIdAndUpdate(productId, {
                            $push: {
                                "bid": {
                                    bidAmount,
                                    userId
                                }
                            },
                            $inc: {
                                "numberOfBids": 1
                            }
                        })
                        .then((bid) => {
                            console.log(bid)
                            res.json({
                                "messgage": "Bid successfully placed!"
                            });
                        }).catch((e) => {
                            console.log(e);
                            res.send(e);
                        });
                })
            })
        }
    }).catch((e) => {
        console.log(e);
        res.json(e);
    });
}

module.exports = placeBid;