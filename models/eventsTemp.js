const mongoose = require('mongoose');

const eventTempSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    cost: {
        type: Number
    },
    image: {
        type: String
    },
    contact: {
        type: Number
    },
    verify: {
        type: String
    },
    eventOwner: {
        type: mongoose.Schema.Types.ObjectId
    }
})

var EventTemp = mongoose.model('EventTemp', eventTempSchema);
module.exports = EventTemp;