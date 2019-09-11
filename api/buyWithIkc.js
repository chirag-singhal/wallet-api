const ShopAndEarnCategory = require('../models/shopAndEarnCategory');
const ShopingDiliveryAddress = require('../models/shopingDiliveryAddress');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');
const User = require('../models/users');
const path = require('path');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');


const buyWithIkc = async (req, res) => {
    const diliveryAddress = await ShopingDiliveryAddress.findById(req.body.diliveryAddressId);

    const shopAndEarnCategory = await ShopAndEarnCategory.findById(req.body.categoryId);

    const subCategory = await shopAndEarnCategory.subCategories.id(req.body.subCategoryId);

    const product = await subCategory.products.id(req.body.productId);

    if(req.body.quantity > product.stock) {
        return res.status(403).json({"message": "The quantity of " + cartProduct.title + " is currently out of stock!"});
    }

    if((req.body.quantity * product.ikcPrice) > req.user.amount) {
        return res.status(403).json({"message": "Not enough ikc balance!"});
    }

    const shopAndEarnOrder = new ShopAndEarnOrder({
        userId: req.user._id,
        product,
        diliveryAddress,
        amount: req.body.quantity * product.ikcPrice,
        quantity: req.body.quantity,
        categoryId: req.body.categoryId,
        subCategoryId: req.body.subCategoryId,
        productId: req.body.productId,
        paymentMethod: "ikc",
        orderDate: Date.now()
    });
    await shopAndEarnOrder.save().then(async () => {
        shopAndEarnOrder.diliveredUrl = path.join(req.headers.host, "/dilivered/", jwt.sign({orderId: shopAndEarnOrder._id}, "This is my secret code for refund process. Its highly complicated"));
        await shopAndEarnOrder.save();
    });

    await User.findByIdAndUpdate(req.user._id, {
        $inc: {
            amount: -(req.body.quantity * product.ikcPrice)
        }
    });

    product.stock -= req.body.quantity;
    product.noOfStockSold += req.body.quantity;
    await shopAndEarnCategory.save();
    await User.findByIdAndUpdate(req.user._id, {
        $push: {
            transactions: {
                transactionId: shortid.generate(),
                transactionStatus: 'TXN_SUCCESS',
                amount: -(req.body.quantity * product.ikcPrice),
                name: 'SHOPPING',
                contact: user.contact,
                paymentType: 'ikc',
                detail: "Bought " + product.title,
                time: Date.now()
            }
        }
    });

    res.json({"message": "Order successfully placed!"});
}

module.exports = buyWithIkc;