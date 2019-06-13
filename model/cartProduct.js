const mongoose = require('mongoose');

const CartProduct = mongoose.model('CartProduct', {
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