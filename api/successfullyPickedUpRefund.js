const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');

const successfullyPickedUpRefund = async (req, res) => {
    const orderToken = req.params.orderToken;

    const  decoded = await jwt.verify(orderToken, "This is my secret code for refund process. Its highly complicated");

    const order = await ShopingOrder.findById(decoded.orderId);

    order.refundUrl = path.join(req.headers.host, "/refund/", jwt.sign({orderId: order._id}, "This is my secret code for refund process. Its highly complicated"));
    await order.save();

    res.send("Product picked up successfully!")
}

module.exports = successfullyPickedUpRefund;