var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
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

const ShoppingOrderSchema = new mongoose.Schema({
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

const BidSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId
  },
  bidAmount: {
    type: Number
  },
  status: {
    type: String
  }
});

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
    unique: true
  },
  countrycode: {
    type: Number,
    default: 91
  },
  verified: {
    type: Boolean,
    default: false
  },
  qrCode: {
    type: String,
    default: uuidv1()
  },
  address: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0
  },
  transactions: [{
    transactionId: String,
    amount: Number,
    name: String,
    contact: String,
    paymentType: String,
    transactionStatus: String,
    detail: String,
    time: Date
  }],
  tickets: [{
    eventId: mongoose.Schema.Types.ObjectId,
    name: String,
    numberOfTickets: Number
  }],
  orders: {
    type: [ShoppingOrderSchema]
  },
  bids: {
    type: [BidSchema]
  },
  tokens: [{
    token: {
      type: String
    }
  }]
});

UserSchema.virtual('cartProducts', {
  ref: 'CartProduct',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.virtual('shopingDiliveryAddress', {
  ref: 'ShopingDiliveryAddress',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.virtual('shopingOrder', {
  ref: 'ShopingOrder',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.virtual('shopAndEarnOrder', {
  ref: 'ShopAndEarnOrder',
  localField: '_id',
  foreignField: 'userId'
});


UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  }
  else next();
});


var User = mongoose.model('User', UserSchema);
module.exports = User;