const CartProduct = require('../models/cartProduct');
const ShopingCategory = require('../models/shopingCategory');

const incrementCartProductQty = async (req, res) => {
    const productId = req.body.productId;

    const cartProduct = await CartProduct.findOne({productId});

    const shopingCategory = await ShopingCategory.findById(cartProduct.categoryId);

    const product = await shopingCategory.products.id(productId);

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