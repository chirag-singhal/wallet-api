const mongoose = require('mongoose');

const DiliveryAddressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone1: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    phone2: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    addressType: {
        type: String,
        required: true
    }
});

const ProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId
    },
    categoryId: {
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
    quantity: {
        type: Number
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

const ShopingOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: ProductSchema
    },
    diliveryAddress: {
        type: DiliveryAddressSchema
    },
    amount: {
        type: Number
    },
    isRefunded: {
        type: Boolean
    },
    isReplaced: {
        type: Boolean
    },
    isDilivered: {
        type: Boolean
    },
    isCancelledBeforeDilivery: {
        type: Boolean
    }
});

const ShopingOrder = mongoose.model('ShopingOrder', ShopingOrderSchema);

module.exports = ShopingOrder;