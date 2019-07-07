const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');


const unsuccessfullyPickedUpRefund = async (req, res) => {
    const orderToken = req.params.orderToken;

    const  decoded = await jwt.verify(orderToken, "This is my secret code for refund process. Its highly complicated");

    let order;

    try {
        order = await ShopingOrder.findById(decoded.orderId);
        if(!order) {
            throw new Error();
        }
    } catch(e) {
        order = await ShopAndEarnOrder.findById(decoded.orderId);
    }
    order.isNotRefunded = true;
    await order.save();

    res.send("Refund unsuccessfull!")
}

module.exports = unsuccessfullyPickedUpRefund;