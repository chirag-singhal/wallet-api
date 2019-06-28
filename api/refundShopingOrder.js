const ShopingOrder = require('../models/shopingOrder');
const ShopingCategory = require('../models/shopingCategory');
const User = require('../models/users');

const refundShopingOrder = async (req, res) => {
    orderId = req.body.orderId;

    const order = await ShopingOrder.findOne({
        '_id': orderId,
        'userId': req.user._id
    });

    if(!order.isDilivered) {
        return res.status(500).send("Product is not yet dilivered! Try 'cancel before dilivery' option");
    }

    if(!order.product.isRefundable) {
        return res.status(500).send("Refund policy is not available for this product!");
    }

    if(order.isRefunded) {
        return res.status(500).send("Product already refunded!");
    }

    await User.findByIdAndUpdate(req.user._id, {
        $inc: {
            'amount': order.amount
        }
    });


    const productId = order.product.productId;
    const subCategoryId = order.product.subCategoryId;
    const categoryId = order.product.categoryId;

    const category = await ShopingCategory.findById(categoryId);
        
    const subCategory = await category.subCategories.id(subCategoryId);

    const productToBeAdded = await subCategory.products.id(productId);

    productToBeAdded.stock += 1;
    await category.save();

    order.isRefunded = true;
    await order.save().then(() => {
        res.send("Product successfully applied for refund!");    
    }).catch((e) => {
        res.send("Something went wrong!", e);
    });
}

module.exports = refundShopingOrder;