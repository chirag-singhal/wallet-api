const mongoose = require('mongoose');

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
    },
    phone1: {
        type: Number,
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
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const DeliveryAddress = mongoose.model('ShopingDeliveryAddress', DeliveryAddressSchema);

module.exports = DeliveryAddress;