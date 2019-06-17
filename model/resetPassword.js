var mongoose = require('mongoose');

var ForgotPasswordSchema = new mongoose.Schema({
    contact:{
        type: Number,
        required: true,
        unique: true
    },
    token: {
        type: String
    }
},{ timestamps: true })

var resetPassword = mongoose.model('resetpassword', ForgotPasswordSchema)
module.exports = resetPassword