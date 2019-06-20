const CartProduct = require('../model/cartProduct');
const ShopingCategory = require('../model/shopingCategory');

const incrementCartProductQty = async (req, res) => {
    const productId = req.body.productId;

    const cartProduct = await CartProduct.findOne({productId});

    const shopingCategory = await ShopingCategory.findById(cartProduct.categoryId);

    const subCategory = await shopingCategory.subCategories.id(cartProduct.subCategoryId);

    const product = await subCategory.products.id(productId);

    if(cartProduct.quantity >= product.stock) {
        return res.status(500).send("No more quantity avaialable");
    }

    await CartProduct.findOneAndUpdate({ productId, userId: req.user._id }, {
        $inc: {
            'quantity': 1
        }
    }).then(() => {
        res.end()
    }).catch((e) => {
        res.status(500).send(e);
    })
}

module.exports = incrementCartProductQty;