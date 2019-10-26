const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Users = require('./users');
const uuidv1 = require('uuid/v1');
const shortid = require('shortid');

const eventSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId
    },
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
    earnings: {
        type: Number,
        default: 0
    },
    ticketSold: {
        type: Number,
        default: 0
    },
    checkedInContacts: {
        type: [Number],
    },
    checkedIn: {
        type: Number,
        default: 0
    }
})

const eventOwnerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    events: {
        type: [eventSchema]
    },
    qrCode: {
        type: String,
        default: shortid.generate(),
        unique: true
    },
    contact: {
        type: Number,
        required: true
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})

eventOwnerSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

eventOwnerSchema.pre('save', function (next) {
    if (this.isNew) {
        var eventOwner = this;
        bcrypt.hash(eventOwner.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            Users.findOne({ "contact": eventOwner.contact }).then((eventVendor) => {
                if (eventVendor == null) {
                    Users.create({
                        username: eventOwner.username,
                        password: hash,
                        verified: true,
                        qrCode: uuidv1(),
                        contact: eventOwner.contact
                    }).then((user) => {
                        eventOwner.walletId = user._id;
                        eventOwner.password = hash;
                        next();
                    })
                        .catch((err) => next(err))
                } else {
                    eventVendor.username = eventOwner.username;
                    eventVendor.password = hash;
                    eventVendor.verified = true;
                    eventVendor.save().then((eventVendorSaved) => {
                        console.log(eventVendorSaved)
                    }).catch((err) => next(err))
                }
            })
        })
    }
    else next();
});

var EventOwner = mongoose.model('EventOwner', eventOwnerSchema);
module.exports = EventOwner;