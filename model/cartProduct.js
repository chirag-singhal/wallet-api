const mongoose = require('mongoose');

const CartProductSchema = new mongoose.Schema({
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
    },
    imageUrl: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const CartProduct = mongoose.model('CartProduct', CartProductSchema);

module.exports = CartProduct;