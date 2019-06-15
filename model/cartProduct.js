const mongoose = require('mongoose');

const CartProduct = mongoose.model('CartProduct', {
    productId: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    description: {
        type: String
    }
});


module.exports = CartProduct;