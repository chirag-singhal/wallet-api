const express = require('express');
const bodyParser = require('body-parser');
const Events = require('../models/events');
const getEvents = express.Router();
getEvents.use(bodyParser.json());

function filter(events) {
    const date = new Date();
    console.log(date)
    var arr = [];
    for(var i = 0; i < events.length; i++){
        if(events[i].startDate > date){
            console.log("found")
            arr.push(events[i]);
        }
    }
    return arr;
}

getEvents.route('/')
.get((req, res, next) => {
    Events.find({}).then((events) => {
        console.log(events)
        const futureEvents = filter(events)
            res.statusCode = 200;
            res.json({
                "events": futureEvents
            })
    }).catch((err) => {
        res.statusCode = 403;
        res.json(err);
    })
})

module.exports = getEvents