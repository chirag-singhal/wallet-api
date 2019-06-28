const ShopingOrder = require('../model/shopingOrder');
const ShopingCategory = require('../model/shopingCategory');
const User = require('../model/users');

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
    const subCategoryId = order.product.subCategoryId;
    const categoryId = order.product.categoryId;

    const category = await ShopingCategory.findById(categoryId);
        
    const subCategory = await category.subCategories.id(subCategoryId);

    const productToBeAdded = await subCategory.products.id(productId);

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