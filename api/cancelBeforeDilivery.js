const ShopingOrder = require('../models/shopingOrder');
const ShopingCategory = require('../models/shopingCategory');
const User = require('../models/users');

const cancelBeforeDilivery = async (req, res) => {
    orderId = req.body.orderId;

    const order = await ShopingOrder.findOne({
        '_id': orderId,
        'userId': req.user._id
    });

    if(order.isDilivered) {
        return res.send("Product already been dilivered!");
    }

    if(order.isCancelledBeforeDilivery) {
        return res.send("Product already been cancelled!")
    }

    await User.findByIdAndUpdate(req.user._id, {
        $inc: {
            'amount': order.amount
        }
    });

    const productId = order.product.productId;
    const categoryId = order.product.categoryId;

    const category = await ShopingCategory.findById(categoryId);

    const productToBeAdded = await category.products.id(productId);

    productToBeAdded.stock += 1;
    await category.save();

    order.isCancelledBeforeDilivery = true;
    await order.save().then(() => {
        res.send("Product successfully cancelled!");    
    }).catch((e) => {
        res.send("Something went wrong!", e);
    });
}

module.exports = cancelBeforeDilivery;