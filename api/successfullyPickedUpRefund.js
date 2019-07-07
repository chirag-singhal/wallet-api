const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');
const ShopAndEarnCategory = require('../models/shopAndEarnCategory');
const ShopingCategory = require('../models/shopingCategory');
const path = require('path');


const successfullyPickedUpRefund = async (req, res) => {
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

    order.refundUrl = path.join(req.headers.host, "/refund/", jwt.sign({orderId: order._id}, "This is my secret code for refund process. Its highly complicated"));
    // order = order.toObject();
    // delete order.pickedUpSuccessfullyRefundUrl;
    // delete order.pickedUpUnsuccessfullyRefundUrl;
    
    await order.save();


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

    res.send("Product picked up successfully!")
}

module.exports = successfullyPickedUpRefund;