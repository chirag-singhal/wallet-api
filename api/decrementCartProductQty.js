const CartProduct = require('../models/cartProduct');
const ShopingCategory = require('../models/shopingCategory');

const decrementCartProductQty = async (req, res) => {
    const productId = req.body.productId;

    const cartProduct = await CartProduct.findOne({productId});

    const shopingCategory = await ShopingCategory.findById(cartProduct.categoryId);

    const subCategory = await shopingCategory.subCategories.id(cartProduct.subCategoryId);

    const product = await subCategory.products.id(productId);

    if(cartProduct.quantity >= product.stock) {
        return CartProduct.findOneAndUpdate({ productId, userId: req.user._id }, {
            $inc: {
                'quantity': product.stock - cartProduct.quantity
            }
        }).then(() => {
            res.end()
        }).catch((e) => {
            res.status(500).send(e);
        }) 
    }

    await CartProduct.findOneAndUpdate({ productId, userId: req.user._id }, {
        $inc: {
            'quantity': -1
        }
    }).then(() => {
        res.end()
    }).catch((e) => {
        res.status(500).send(e);
    })
}

module.exports = decrementCartProductQty;