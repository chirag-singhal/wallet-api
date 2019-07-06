const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');

const dilivered = async (req, res) => {
    const orderToken = req.params.orderToken;

    const  decoded = await jwt.verify(orderToken, "This is my secret code for refund process. Its highly complicated");

    const order = await ShopingOrder.findById(decoded.orderId);

    order.isDilivered = true;
    await order.save();

    res.send("Product dilivered!")
}

module.exports = dilivered;