const CartProduct = require('../model/cartProduct');
const User = require('../model/users');
const ShopingCategory = require('../model/shopingCategory');

const getCartProducts = async (req, res) => {
    try {
        await req.user.populate('cartProducts').execPopulate();
        res.send(req.user.cartProducts);
    } catch(e) {
        res.status(500).send(e);
    }
}

module.exports = getCartProducts;