const AuctionProduct = require('../model/auctionProducts');

const placeBid = (req, res) => {
    const productId = req.body.productId;
    const bidAmount = req.body.bidAmount;
    const bidRemark = req.body.bidRemark;
    const userId = req.body.userId;

    AuctionProduct.findById(productId).then((product) => {
        if(!product) {
            return res.status(500).send("Invalid Product Id!");
        }

        return AuctionProduct.findOne({ 'bid.userId': userId })

    }).then((user) => {
        if(user) {
            return res.send("Bid already placed!");
        }

        AuctionProduct.findByIdAndUpdate(productId, {
            $push: {
                "bid": {
                    bidAmount,
                    bidRemark,
                    userId
                }
            }
        })
        .then(() => {
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