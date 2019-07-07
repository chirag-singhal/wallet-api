const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');

const successfullyPickedUpReplace = async (req, res) => {
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

    order.isDilivered = false;
    order.isAppliedForReplace = false;
    order.noOfReplace += 1;
    await order.save();

    res.send("Product picked up successfully!")
}

module.exports = successfullyPickedUpReplace;