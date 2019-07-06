const mongoose = require('mongoose');
const ShopingCategory = require('../models/shopingCategory');
const CartProduct = require('../models/cartProduct');


const addToCart = (req, res) => {
    const productId = req.body.productId;
    const categoryId = req.body.categoryId;


    ShopingCategory.findById(categoryId).then((category) => {

        productIdToBeAdded = category.products.id(productId);
        if(!productIdToBeAdded) {
            return res.status(404).send("Invalid product ID!");
        }

        CartProduct.findOne({ productId, userId: req.user._id }).then((cartProducts) => {
            if(cartProducts) {
                return res.status(400).send("Item already exists in cart!");
            }
            
            productIdToBeAdded = productIdToBeAdded.toObject();
            delete productIdToBeAdded._id

            const cartProduct = new CartProduct({
                ...productIdToBeAdded,
                quantity: 1,
                productId,
                categoryId,
                userId: req.user._id
            });
            cartProduct.save().then(() => {
                console.log(cartProduct);
                res.status(201).send("Item added to cart!")
            }).catch((e) => {
                console.log(e)
                return res.send(e);
            });
        }).catch((e) => {
            console.log(e)
            return res.send(e);
        });
    }).catch(() => {
        res.status(404).send("Invalid category ID!");
    });
}

module.exports = addToCart;