const mongoose = require('mongoose');

const CartProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isReplaceable: {
        type: Boolean,
        required: true
    },
    isRefundable: {
        type: Boolean,
        required: true
    }
});

const CartProduct = mongoose.model('CartProduct', CartProductSchema);

module.exports = CartProduct;