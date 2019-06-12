const mongoose = require('mongoose');

const CartProduct = mongoose.model('Cart-Product', {
    productId: {
        type: String
    }
});


module.exports = CartProduct;