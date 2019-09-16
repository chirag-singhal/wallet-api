const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');

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
    product: {
        type: ProductSchema
    },
    diliveryAddress: {
        type: DiliveryAddressSchema
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
    diliveredDate: {
        type: Date
    },
    status: {
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
    isDilivered: {
        type: Boolean,
        default: false
    },
    isCancelledBeforeDilivery: {
        type: Boolean,
        default: false
    },
    diliveredUrl: {
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

const DeliverySchema = new mongoose.Schema({
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
    qrCode: {
        type: String,
        default: uuidv1()
    },
    contact: {
        type: Number,
        required: true
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})

DeliverySchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

DeliverySchema.pre('save', function (next) {
    if(this.isNew){
      var user = this;
      bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      })
    } 
    else next();
  });

var DeliveryPerson = mongoose.model('DeliveryPerson', DeliverySchema);
module.exports = DeliveryPerson;