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
  country: {
      type: String,
      required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  transactions : []
});

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });
  

var User = mongoose.model('User', UserSchema);
module.exports = User;