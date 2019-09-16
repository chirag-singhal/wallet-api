const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
        type: Buffer
    },
    contact: {
        type: Number
    },
    eventOwner: {
        type: mongoose.Schema.Types.ObjectId
    }
})

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;