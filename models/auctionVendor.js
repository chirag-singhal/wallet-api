const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Users = require('./users');
const uuidv1 = require('uuid/v1');
const shortid = require('shortid');

const DeliveryAddressSchema = new mongoose.Schema({
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
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
    }
});
const BidSchema = new mongoose.Schema({
    bidAmount: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

const AuctionProductSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId
    },
    auctionId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    quantity: {
        type: Number
    },
    numberOfBids: {
        type: Number
    },
    duration: {
        type: String
    },
    imageUrl: {
        type: String
    },
    startDate: {
        type: Date
    },
    results: {
        type: Boolean,
        default: false
    },
    endDate: {
        type: Date
    },
    bid: {
        type: [BidSchema]
    },
    deliveryAddress: {
        type: DeliveryAddressSchema
    },
    winner: {
        winner: mongoose.Schema.Types.ObjectId,
        bidAmount: Number
    }
});

const AuctionOrderSchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    product: {
      type: AuctionProductSchema
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

const AuctionVendorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    auctions: {
        type: [AuctionProductSchema]
    },
    orders: {
        type: [AuctionOrderSchema]
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

AuctionVendorSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

AuctionVendorSchema.pre('save', function (next) {
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
                    eventVendor.save().then((eventVendorSaved) => {
                        console.log(eventVendorSaved)
                        eventOwner.walletId = eventVendor._id;
                        eventOwner.password = hash;
                        next();
                    }).catch((err) => next(err))
                }
            })
        })
    }
    else next();
});

var AuctionVendor = mongoose.model('AuctionVendor', AuctionVendorSchema);
module.exports = AuctionVendor;