const CartProduct = require('../model/cartProduct');
const ShopingCategory = require('../model/shopingCategory');
const ShopingDiliveryAddress = require('../model/shopingDiliveryAddress');
const ShopingOrder = require('../model/shopingOrder');
const User = require('../model/users');


const checkoutShopingCart = async (req, res) => {
    const cartProducts = await CartProduct.find( {} );
    
    let amount = 0;
    let isOutOfStock = false;
    let productOutOfStock;

    for(const cartProduct of cartProducts) {
        const shopingCategory = await ShopingCategory.findById(cartProduct.categoryId);

        const subCategory = await shopingCategory.subCategories.id(cartProduct.subCategoryId);
    
        const product = await subCategory.products.id(cartProduct.productId);

        if(cartProduct.quantity > product.stock) {
            return res.status(500).send(cartProduct.title, " is currently out of stock!");
        }

        amount += cartProduct.price * cartProduct.quantity;
    }

    if(amount > req.user.amount) {
        return res.status(500).send("Not enough ikc balance!");
    }

    const diliveryAddress = await ShopingDiliveryAddress.findById(req.body.diliveryAddressId);

    await User.findByIdAndUpdate(req.user._id, {
        $inc: {
            amount: -amount
        }
    })

    for(const cartProduct of cartProducts) {
        const shopingOrder = new ShopingOrder({
            userId: req.user_id,
            product: cartProduct,
            diliveryAddress,
            isRefunded: false,
            isReplaced: false,
            isDilivered: false
        });
        await shopingOrder.save();
    }

    res.send("Order successfully placed!");
}

module.exports = checkoutShopingCart;