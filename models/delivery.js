const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');

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

const AuctionProductSchema = new mongoose.Schema({
    auctionId: {
      type: mongoose.Schema.Types.ObjectId
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
        type: Buffer
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    auctionCreator: {
        type: mongoose.Schema.Types.ObjectId
    },
    winner: {
        winner: mongoose.Schema.Types.ObjectId,
        bidAmount: Number
    }
  });

  const AuctionOrderSchema = new mongoose.Schema({
    orderId: {
      type: String,
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

const ProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId
    },
    userId: {
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
    DeliveryAddress: {
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
    auctionOrders: {
        type: [AuctionOrderSchema]
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