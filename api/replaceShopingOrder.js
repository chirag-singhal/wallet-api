const ShopingOrder = require('../models/shopingOrder');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');
const jwt = require('jsonwebtoken');
const path = require('path');

const replaceShopingOrder = async (req, res) => {
    orderId = req.body.orderId;

    let order;

    try {
        order = await ShopingOrder.findOne({
            '_id': orderId,
            'userId': req.user._id
        });

        if(!order) {
            throw new Error();
        }
    } catch(e) {
        order = await ShopAndEarnOrder.findOne({
            '_id': orderId,
            'userId': req.user._id
        });
    }


    if(Date.now() - order.diliveredDate.getTime() > 2592000000) {
        return res.status(500).send("Replace period is over!");
    }

    if(!order.isDilivered) {
        return res.status(500).send("Product is not yet dilivered! Try 'cancel before dilivery' option");
    }

    if(order.isRefunded) {
        return res.status(500).send("Product already been refunded");
    }

    if(!order.product.isReplaceable) {
        return res.status(500).send("Refund policy is not available for this product!");
    }

    if(order.isReplaced) {
        return res.status(500).send("Product already replaced!");
    }

    if(order.isNotReplaced || order.isNotRefunded || order.isAppliedForRefund || order.isAppliedForReplace) {
        return res.status(500).send("Sorry, product cannot be replaced!");
    }

    order.isAppliedForReplace = true;
    order.pickedUpSuccessfullyReplaceUrl = path.join(req.headers.host, "/successfullyPickedUpReplace/", jwt.sign({orderId: order._id}, "This is my secret code for refund process. Its highly complicated"));
    order.pickedUpUnsuccessfullyReplaceUrl = path.join(req.headers.host, "/unsuccessfullyPickedUpReplace/", jwt.sign({orderId: order._id}, "This is my secret code for refund process. Its highly complicated"));
    await order.save().then(() => {
        res.send("Product successfully applied for replace!");    
    }).catch((e) => {
        res.send("Something went wrong!", e);
    });
}

module.exports = replaceShopingOrder;