const mongoose = require('mongoose');

const IkcTransferSchema = new mongoose.Schema({
    to: {
        type: Number
    },
    amount: {
        type: Number
    },
    date: {
        type: Number,
        default: Date.now()
    }
});

const IkcTransfer = mongoose.model('IkcTransfer', IkcTransferSchema);

module.exports = IkcTransfer;