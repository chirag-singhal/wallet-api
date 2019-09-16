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
    categoryId: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    offererId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

const ShopingOrderSchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: ProductSchema
    },
    deliveryAddress: {
        type: DeliveryAddressSchema
    },
    amount: {
        type: Number
    },
    quantity: {
        type: Number
    },
    orderDate: {
        type: Number,
        default: Date.now()
    },
    deliveredDate: {
        type: Date
    },
    status: {
        type: String,
        default: 'Successfully Placed'
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
    isDelivered: {
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


const ShopingOrder = mongoose.model('ShopingOrder', ShopingOrderSchema);

module.exports = ShopingOrder;