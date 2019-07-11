const AuctionProduct = require('../models/auctionProducts');

const placeBid = (req, res) => {
    const productId = req.body.productId;
    const bidAmount = req.body.bidAmount;
    // const bidRemark = req.body.bidRemark;
    const userId = req.user._id;
    console.log(userId)

    AuctionProduct.findById(productId).then((product) => {
        if(!product) {
            return res.status(500).send("Invalid Product Id!");
        }

        return AuctionProduct.findOne({ '_id': req.body.productId })

    }).then((product) => {
        if(product.bid.userId == req.user._id) {
            console.log(user)
            return res.send("Bid already placed!");
        }

        AuctionProduct.findByIdAndUpdate(productId, {
            $push: {
                "bid": {
                    bidAmount,
                    // bidRemark,
                    userId
                }
            },
            $inc: {
                "numberOfBids": 1
            }
        })
        .then((bid) => {
            console.log(bid)
            res.send("Bid successfully placed!");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });
}

module.exports = placeBid;