const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Users = require('./users');
const uuidv1 = require('uuid/v1');
const shortid = require('shortid');

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

const ShoppingOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: String
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

const ShopVendorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orders: {
        type: [ShoppingOrderSchema]
    },
    contact: {
        type: Number,
        required: true
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})

ShopVendorSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

ShopVendorSchema.pre('save', function (next) {
    if (this.isNew) {
        var eventOwner = this;
        bcrypt.hash(eventOwner.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            Users.findOne({ "contact": eventOwner.contact }).then((eventVendor) => {
                if (eventVendor == null) {
                    Users.create({
                        username: eventOwner.username,
                        password: hash,
                        verified: true,
                        contact: eventOwner.contact
                    }).then((user) => {
                        eventOwner.walletId = user._id;
                        eventOwner.password = hash;
                        next();
                    })
                        .catch((err) => next(err))
                } else {
                    eventVendor.username = eventOwner.username;
                    eventVendor.password = hash;
                    eventVendor.verified = true;
                    eventVendor.save().then((eventVendorSaved) => {
                        console.log(eventVendorSaved)
                    }).catch((err) => next(err))
                }
            })
        })
    }
    else next();
});

var ShopVendor = mongoose.model('ShopVednor', ShopVendorSchema);
module.exports = ShopVendor;