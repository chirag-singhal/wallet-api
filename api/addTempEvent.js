const express = require('express');
const bodyParser = require('body-parser');

const EventTemp = require('../models/eventsTemp')
const path = require('path');
const jwt = require('jsonwebtoken');

const addTempEvent = express.Router();
addTempEvent.use(bodyParser.json());

addTempEvent.route('/')
.post((req, res, next) => {
    console.log("add temp event");
    EventTemp.create(req.body)
    .then((eventTemp) => {
        console.log(eventTemp)
        eventTemp.eventOwner = req.user._id;
        eventTemp.verify = path.join(req.headers.host, "/addEvent/", jwt.sign({eventId: eventTemp._id}, "This is my secret code for adding event to IKC Deal. Its highly complicated"));
        eventTemp.save().then((eventTempWithUrl) => {
            console.log(eventTempWithUrl)
            res.statusCode = 200;
            res.json({"message": "Event Created"})
        }).catch((err) => next(err))
    }).catch((err) => {
        res.statusCode = 403;
        res.json(err);
    })
})

module.exports = addTempEvent