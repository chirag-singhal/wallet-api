const mongoose = require('mongoose');

const CartProduct = mongoose.model('Cart-Product', {
    productId: {
        type: String
    },
    subCategoryId: {
        type: String
    },
    categoryId: {
        type: String
    }
});


module.exports = CartProduct;