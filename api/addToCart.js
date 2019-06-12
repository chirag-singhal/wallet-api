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

        productIdToBeAdded = subCategory.products.id(productId).id;
        if(!productIdToBeAdded) {
            return res.status(404).send("Invalid product ID!");
        }
            
        const cartProduct = new CartProduct( {productId: productIdToBeAdded} );
        cartProduct.save().then(() => {
            console.log(cartProduct);
            res.status(201).send("Item added to cart!")
        }).catch((e) => {
            console.log(e);
        });
    }).catch(() => {
        res.status(404).send("Invalid category ID!");
    });
}

module.exports = addToCart;