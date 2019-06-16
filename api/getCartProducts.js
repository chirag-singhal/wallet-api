const CartProduct = require('../model/cartProduct');
const ShopingCategory = require('../model/shopingCategory');

const getCartProducts = (req, res) => {
    CartProduct.find( {} ).then((cartProducts) => {
        res.send(cartProducts);
    }).catch((e) => {
        res.status(500).send(e);
    });
}

module.exports = getCartProducts;