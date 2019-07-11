const mongoose = require('mongoose');

const WalletAddSchema = new mongoose.Schema({
    transactionId: {
        type: String
    },
    transactionStatus: {
        type: String
    },
    amount: {
        type: Number
    },
    transactionDate: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const WalletAdd = mongoose.model('WalletAdd', WalletAddSchema);

module.exports = WalletAdd