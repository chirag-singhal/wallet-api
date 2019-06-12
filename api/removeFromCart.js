const mongoose = require('mongoose');

const CartProduct = require('../model/cartProduct');

const removeFromCart = (req, res) => {
    const productId = req.body.productId;

    CartProduct.deleteOne( {
        productId
    } ).then(() => {
        res.send("Item removed from cart!");
    }).catch((e) => {
        res.status(500).send(e);
    })
}

module.exports = removeFromCart;