const ShopingOrder = require('../models/shopingOrder');
const User = require('../models/users');

const replaceShopingOrder = async (req, res) => {
    orderId = req.body.orderId;

    const order = await ShopingOrder.findOne({
        '_id': orderId,
        'userId': req.user._id
    });

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

    order.isReplaced = true;
    await order.save().then(() => {
        res.send("Product successfully applied for replace!");    
    }).catch((e) => {
        res.send("Something went wrong!", e);
    });
}

module.exports = replaceShopingOrder;