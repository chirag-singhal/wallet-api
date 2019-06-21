var mongoose = require('mongoose');
const bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
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
      required: true
  },
  verified:{
    type: Boolean,
    default: false
  },
  address: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0
  },
  transactions : [],
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


UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
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
});


var User = mongoose.model('User', UserSchema);
module.exports = User;