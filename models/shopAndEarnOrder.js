const mongoose = require('mongoose');
require('mongoose-type-url')

const DeliveryAddressSchema = new mongoose.Schema({
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
    title: {
        type: String
    },
    ikcPrice: {
        type: Number
    },
    inrPrice: {
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
    stock: {
        type: Number
    },
    noOfStockSold: {
        type: Number
    },
    isReplaceable: {
        type: Boolean
    },
    isRefundable: {
        type: Boolean
    }
});

const ShopAndEarnOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId
    },
    product: {
        type: ProductSchema
    },
    DeliveryAddress: {
        type: DeliveryAddressSchema
    },
    quantity: {
        type: Number
    },
    amount: {
        type: Number
    },
    orderDate: {
        type: Number,
        default: Date.now()
    },
    deliveredDate: {
        type: Date
    },
    gatewayTransactionId: {
        type: String
    },
    gatewayTransactionStatus: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    isAppliedForRefund: {
        type: Boolean,
        default: false
    },
    isAppliedForReplace: {
        type: Boolean,
        default: false
    },
    isRefunded: {
        type: Boolean,
        default: false
    },
    isNotRefunded: {
        type: Boolean,
        default: false
    },
    noOfReplace: {
        type: Number,
        default: 0
    },
    isNotReplaced: {
        type: Boolean,
        default: false
    },
    isdelivered: {
        type: Boolean,
        default: false
    },
    isCancelledBeforeDelivery: {
        type: Boolean,
        default: false
    },
    deliveredUrl: {
        type: mongoose.SchemaTypes.Url
    },
    pickedUpSuccessfullyReplaceUrl: {
        type: mongoose.SchemaTypes.Url
    },
    pickedUpUnsuccessfullyReplaceUrl: {
        type: mongoose.SchemaTypes.Url
    },
    pickedUpSuccessfullyUrl: {
        type: mongoose.SchemaTypes.Url
    },
    pickedUpUnsuccessfullyUrl: {
        type: mongoose.SchemaTypes.Url
    },
    refundUrl: {
        type: mongoose.SchemaTypes.Url
    }
});


const ShopAndEarnOrder = mongoose.model('ShopAndEarnOrder', ShopAndEarnOrderSchema);

module.exports = ShopAndEarnOrder;