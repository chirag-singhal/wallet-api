const CartProduct = require('../model/cartProduct');
const ShopingCategory = require('../model/shopingCategory');

const getCartProducts = (req, res) => {
    CartProduct.find( {} ).then((cartProducts) => {
        cartProducts.forEach(cartProduct => {
            const productId = cartProduct.productId;
            const subCategoryId = cartProduct.subCategoryId;
            const categoryId = cartProduct.categoryId;
        

            ShopingCategory.findById(categoryId).then((category) => {
                const subCategory = category.subCategories.id(subCategoryId);
                if(!subCategory) {
                    return res.status(404).send("Invalid sub-category ID!");
                }

                const product = subCategory.products.id(productId);
                if(!product) {
                    return res.status(404).send("Invalid product ID!");
                }
                res.json(product);
            }).catch((e) => {
                console.log(e);
                return res.status(404).send("Invalid category ID!");
            })
        });
    }).catch((e) => {
        console.log(e);
        return res.send(e);
    });
}

module.exports = getCartProducts;