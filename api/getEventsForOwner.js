const express = require('express');
const bodyParser = require('body-parser');
const EventsOwner = require('../models/eventOwner');
const getEventsForOwner = express.Router();
getEventsForOwner.use(bodyParser.json());

getEventsForOwner.route('/')
.get((req, res, next) => {
    EventsOwner.findById(req.user._id).then((eventOwner) => {
        res.statusCode = 200;
        res.json({
            "events": eventOwner.events,
            "totalEarnings": eventOwner.totalEarnings
        })
    }).catch((err) => {
        res.statusCode = 403;
        res.json(err);
    })
})

module.exports = getEventsForOwner