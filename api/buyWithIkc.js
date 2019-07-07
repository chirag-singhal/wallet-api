const ShopAndEarnCategory = require('../models/shopAndEarnCategory');
const ShopingDiliveryAddress = require('../models/shopingDiliveryAddress');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');
const User = require('../models/users');
const path = require('path');
const jwt = require('jsonwebtoken');


const buyWithIkc = async (req, res) => {
    const diliveryAddress = await ShopingDiliveryAddress.findById(req.body.diliveryAddressId);

    const shopAndEarnCategory = await ShopAndEarnCategory.findById(req.body.categoryId);

    const subCategory = await shopAndEarnCategory.subCategories.id(req.body.subCategoryId);

    const product = await subCategory.products.id(req.body.productId);

    if(req.body.quantity > product.stock) {
        return res.status(500).send("The quantity of " + cartProduct.title + " is currently out of stock!");
    }

    if((req.body.quantity * product.ikcPrice) > req.user.amount) {
        return res.status(500).send("Not enough ikc balance!");
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
        paymentMethod: "ikc"
    });
    await shopAndEarnOrder.save().then(async () => {
        shopAndEarnOrder.diliveredUrl = path.join(req.headers.host, "/dilivered/", jwt.sign({orderId: shopAndEarnOrder._id}, "This is my secret code for refund process. Its highly complicated"));
        await ShopAndEarnOrder.updateOne({ _id: shopAndEarnOrder._id }, { $currentDate: {
                orderDate: true
            }
        });
        await shopAndEarnOrder.save();
    });

    await User.findByIdAndUpdate(req.user._id, {
        $inc: {
            amount: -(req.body.quantity * product.ikcPrice)
        }
    });

    product.stock -= 1;
    product.noOfStockSold += 1;
    await shopAndEarnCategory.save();

    res.send("Order successfully placed!");
}

module.exports = buyWithIkc;