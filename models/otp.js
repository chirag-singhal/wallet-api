var mongoose = require('mongoose');

var OTPSchema = new mongoose.Schema({
    contact:{
        type: Number,
        required: true,
        unique: true
    },
    otp: {
        type: Number
    }
},{ timestamps: true })

var otp = mongoose.model('otp', OTPSchema)
module.exports = otp