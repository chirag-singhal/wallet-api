const CartProduct = require('../models/cartProduct');
const ShopingCategory = require('../models/shopingCategory');
const ShopingDiliveryAddress = require('../models/shopingDiliveryAddress');
const ShopingOrder = require('../models/shopingOrder');
const User = require('../models/users');
const path = require('path');
const jwt = require('jsonwebtoken');


const checkoutShopingCart = async (req, res) => {
    const cartProducts = await CartProduct.find({ userId: req.user._id });
    
    let amount = 0;
    let isOutOfStock = false;
    let productOutOfStock;

    for(const cartProduct of cartProducts) {
        amount += cartProduct.price * cartProduct.quantity;
    }

    if(amount > req.user.amount) {
        return res.status(500).send("Not enough ikc balance!");
    }

    const diliveryAddress = await ShopingDiliveryAddress.findById(req.body.diliveryAddressId);

    for(const cartProduct of cartProducts) {
        const shopingCategory = await ShopingCategory.findById(cartProduct.categoryId);
    
        const product = await shopingCategory.products.id(cartProduct.productId);

        if(cartProduct.quantity > product.stock) {
            return res.status(500).send("The quantity of " + cartProduct.title + " is currently out of stock!");
        }

        const shopingOrder = new ShopingOrder({
            userId: req.user._id,
            product: cartProduct,
            diliveryAddress,
            amount: cartProduct.quantity * cartProduct.price
        });
        await shopingOrder.save().then(async () => {
            shopingOrder.diliveredUrl = path.join(req.headers.host, "/dilivered/", jwt.sign({orderId: shopingOrder._id}, "This is my secret code for refund process. Its highly complicated"));
            await ShopingOrder.update({ _id: shopingOrder._id }, { $currentDate: {
                    orderDate: true
                }
            });
            await shopingOrder.save();
        });

        await User.findByIdAndUpdate(req.user._id, {
            $inc: {
                amount: -(cartProduct.quantity * cartProduct.price)
            }
        });

        product.stock -= 1;
        await shopingCategory.save();

        await CartProduct.deleteOne({productId: cartProduct.productId});
    }

    res.send("Order successfully placed!");
}

module.exports = checkoutShopingCart;