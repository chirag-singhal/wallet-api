const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');
const User = require('../models/users');
const ShopingCategory = require('../models/shopingCategory');

const refund = async (req, res) => {
    const orderToken = req.params.orderToken;

    const  decoded = await jwt.verify(orderToken, "This is my secret code for refund process. Its highly complicated");

    const order = await ShopingOrder.findById(decoded.orderId);


    await User.findByIdAndUpdate(req.user._id, {
        $inc: {
            'amount': order.amount
        }
    });

    const productId = order.product.productId;
    const categoryId = order.product.categoryId;

    const category = await ShopingCategory.findById(categoryId);

    const product = await shopingCategory.products.id(productId);

    product.stock += 1;
    await category.save();

    order.isRefunded = true;
    await order.save();

    res.send("Product dilivered!")
}

module.exports = refund;