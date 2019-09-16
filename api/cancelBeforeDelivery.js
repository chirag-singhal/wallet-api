const ShopingOrder = require('../models/shopingOrder');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');
const ShopingCategory = require('../models/shopingCategory');
const ShopAndEarnCategory = require('../models/shopAndEarnCategory');
const User = require('../models/users');
const shortid = require('shortid');

const cancelBeforeDelivery = async (req, res) => {
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

    if(order.isdelivered) {
        return res.send("Product already been delivered!");
    }

    if(order.isCancelledBeforeDelivery) {
        return res.send("Product already been cancelled!")
    }
    const user = await User.findById(req.user._id);
    
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

    order.isCancelledBeforeDelivery = true;
    await order.save().then(async () => {
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                transactions: {
                    transactionId: shortid.generate(),
                    transactionStatus: 'TXN_SUCCESS',
                    amount: order.amount,
                    name: 'REFUND',
                    contact: user.contact,
                    paymentType: 'ikc',
                    detail: "Refund for " + order.product.title,
                    time: Date.now()
                }
            }
        });
        res.send("Product successfully cancelled!");    
    }).catch((e) => {
        res.send("Something went wrong!", e);
    });
}

module.exports = cancelBeforeDelivery;