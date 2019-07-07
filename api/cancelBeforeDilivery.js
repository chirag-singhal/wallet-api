const ShopingOrder = require('../models/shopingOrder');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');
const ShopingCategory = require('../models/shopingCategory');
const ShopAndEarnCategory = require('../models/shopAndEarnCategory');
const User = require('../models/users');

const cancelBeforeDilivery = async (req, res) => {
    orderId = req.body.orderId;

    let order;

    try {
        order = await ShopingOrder.findOne({
            '_id': orderId,
            'userId': req.user._id
        });
        if(!order) {
            throw new Error()
        }
    } catch(e) {
        order = await ShopAndEarnOrder.findOne({
            '_id': orderId,
            'userId': req.user._id
        });
    }

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

    const productId = order.productId;
    const categoryId = order.categoryId;
    let subCategoryId;

    let category;
    let subCategory;
    let productToBeAdded;

    if(order.subCategoryId) {
        subCategoryId = order.subCategoryId;

        category = await ShopAndEarnCategory.findById(categoryId);
        subCategory = await category.subCategories.id(subCategoryId);
        productToBeAdded = await subCategory.products.id(productId);
        productToBeAdded.noOfStockSold -= 1;
    } else {
        category = await ShopingCategory.findById(categoryId);
        productToBeAdded = await category.products.id(productId);
    }



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