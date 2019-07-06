const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');

const unsuccessfullyPickedUpRefund = async (req, res) => {
    const orderToken = req.params.orderToken;

    const  decoded = await jwt.verify(orderToken, "This is my secret code for refund process. Its highly complicated");

    const order = await ShopingOrder.findById(decoded.orderId);

    order.isNotRefunded = true;
    await order.save();

    res.send("Refund unsuccessfull!")
}

module.exports = unsuccessfullyPickedUpRefund;