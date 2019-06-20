const mongoose = require('mongoose');
const ShopingCategory = require('../model/shopingCategory');
const CartProduct = require('../model/cartProduct');


const addToCart = (req, res) => {
    const productId = req.body.productId;
    const subCategoryId = req.body.subCategoryId;
    const categoryId = req.body.categoryId;

    let category;
    let subCategory;
    let productIdToBeAdded;

    ShopingCategory.findById(categoryId).then((category) => {
        
        subCategory = category.subCategories.id(subCategoryId);
        if(!subCategory) {
            return res.status(404).send("Invalid sub-category ID!");
        }

        productIdToBeAdded = subCategory.products.id(productId);
        if(!productIdToBeAdded) {
            return res.status(404).send("Invalid product ID!");
        }

        CartProduct.findOne({ productId, userId: req.user._id }).then((cartProducts) => {
            if(cartProducts) {
                return res.status(400).send("Item already exists in cart!");
            }

            const cartProduct = new CartProduct({
                title: productIdToBeAdded.title,
                price: productIdToBeAdded.price,
                discount: productIdToBeAdded.discount,
                description: productIdToBeAdded.description,
                imageUrl: productIdToBeAdded.imageUrl,
                productId,
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