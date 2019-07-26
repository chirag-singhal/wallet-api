const express = require('express');
const bodyParser = require('body-parser');
const  EventTemp = require('../models/eventsTemp');
const Events = require('../models/events');
const EventOwner = require('../models/eventOwner')
const addEvent = express.Router();
addEvent.use(bodyParser.json());
const jwt = require('jsonwebtoken');


addEvent.route('/:eventToken')
.get(async (req, res, next) => {
    const eventToken = req.params.eventToken;
    console.log(eventToken)
    const  decoded = await jwt.verify(eventToken, "This is my secret code for adding event to IKC Deal. Its highly complicated");
    
    EventTemp.findById(decoded.eventId).then((eventTemp) => {
        Events.create({
            name: eventTemp.name,
            description: eventTemp.description,
            venue: eventTemp.venue,
            startDate: eventTemp.startDate,
            endDate: eventTemp.endDate,
            cost: eventTemp.cost,
            image: eventTemp.image,
            contact: eventTemp.contact,
            eventOwner: eventTemp.eventOwner
        }).then((event) => {
            EventOwner.findById(event.eventOwner).then((eventOwner) => {
                eventOwner.events.push({
                    eventId: event._id,
                    name: eventTemp.name,
                    description: eventTemp.description,
                    venue: eventTemp.venue,
                    startDate: eventTemp.startDate,
                    endDate: eventTemp.endDate,
                    cost: eventTemp.cost,
                    image: eventTemp.image,
                })
                eventOwner.save().then(() => {
                    EventTemp.findByIdAndDelete(decoded.eventId).then(() => {
                        console.log(event);
                        res.statusCode = 200;
                        res.json({"message": "Event Added to IKC Deal"});
                    }).catch((err) => next(err))
                }).catch((err) => next(err))
            }).catch((err) => next(err))
        }).catch((err) => next(err))
    }).catch((err) => {
        res.statusCode = 403;
        res.json(err)
    })

})

module.exports = addEvent