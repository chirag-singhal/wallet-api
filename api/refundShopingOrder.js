const ShopingOrder = require('../models/shopingOrder');
const ShopingCategory = require('../models/shopingCategory');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const path = require('path');

const refundShopingOrder = async (req, res) => {
    orderId = req.body.orderId;

    const order = await ShopingOrder.findOne({
        '_id': orderId,
        'userId': req.user._id
    });

    if(!order.isDilivered) {
        return res.status(500).send("Product is not yet dilivered! Try 'cancel before dilivery' option");
    }

    if(!order.product.isRefundable) {
        return res.status(500).send("Refund policy is not available for this product!");
    }

    if(order.isRefunded) {
        return res.status(500).send("Product already refunded!");
    }

    if(order.isNotRefunded) {
        return res.status(500).send("Sorry, product cannot be refunded!")
    }

    order.isAppliedForRefund = true;
    order.pickedUpSuccessfullyUrl = path.join(req.headers.host, "/successfullyPickedUpRefund/", jwt.sign({orderId: order._id}, "This is my secret code for refund process. Its highly complicated"));
    order.pickedUpUnsuccessfullyUrl = path.join(req.headers.host, "/unsuccessfullyPickedUpRefund/", jwt.sign({orderId: order._id}, "This is my secret code for refund process. Its highly complicated"));
    await order.save().then(() => {
        res.send("Product successfully applied for refund!");    
    }).catch((e) => {
        res.send("Something went wrong!", e);
    });
}

module.exports = refundShopingOrder;