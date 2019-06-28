const CartProduct = require('../models/cartProduct');
const ShopingCategory = require('../models/shopingCategory');
const ShopingDiliveryAddress = require('../models/shopingDiliveryAddress');
const ShopingOrder = require('../models/shopingOrder');
const User = require('../models/users');


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

        const subCategory = await shopingCategory.subCategories.id(cartProduct.subCategoryId);
    
        const product = await subCategory.products.id(cartProduct.productId);

        if(cartProduct.quantity > product.stock) {
            return res.status(500).send(cartProduct.title, " is currently out of stock!");
        }

        const shopingOrder = new ShopingOrder({
            userId: req.user._id,
            product: cartProduct,
            diliveryAddress,
            amount: cartProduct.quantity * cartProduct.price,
            isRefunded: false,
            isReplaced: false,
            isDilivered: false,
            isCancelledBeforeDilivery: false
        });
        await shopingOrder.save();

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