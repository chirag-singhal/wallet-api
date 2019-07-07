const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');

const dilivered = async (req, res) => {
    const orderToken = req.params.orderToken;

    const  decoded = await jwt.verify(orderToken, "This is my secret code for refund process. Its highly complicated");

    let order;
    try {
        order = await ShopingOrder.findById(decoded.orderId);
        if(!order) {
            throw new Error();
        }
        await ShopingOrder.update({ _id: order._id }, { $currentDate: {
                diliveredDate: true
            }
        });
    } catch(e) {
        order = await ShopAndEarnOrder.findById(decoded.orderId);
        await ShopAndEarnOrder.update({ _id: order._id }, { $currentDate: {
                diliveredDate: true
            }
        });
    }
    order.isDilivered = true;
    await order.save();

    res.send("Product dilivered!")
}

module.exports = dilivered;