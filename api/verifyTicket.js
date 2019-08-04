const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/users');
const EventOwner = require('../models/eventOwner');
const Events = require('../models/events');

const verifyTicket = express.Router();

verifyTicket.use(bodyParser.json());

verifyTicket.route('/')
.post((req, res, next) => {
    Users.findOne({qrCode: req.body.qrCode}).then((user) => {
        for(var i = 0; i < user.tickets.length; i++){
            if(user.tickets[i].eventId == req.body.eventId){
                if(!user.tickets[i].numberOfTickets > 0){
                    res.statusCode = 404;
                    res.json({"message": "No Ticket Found"})
                }
                else{
                    user.tickets[i].numberOfTickets--;
                    if(user.tickets[i].numberOfTickets == 0){
                        user.tickets.splice(i, 1);
                    }
                }
                break;
            }
        }
        console.log("ticket found")
        user.save().then((userSaved) => {
            console.log(userSaved);
                EventOwner.findById(req.user._id).then((eventOwner) => {
                    console.log(eventOwner)
                    for(var i = 0; i < eventOwner.events.length; i++){
                        console.log("Find event")
                        if(eventOwner.events[i]._id == req.body.eventId){
                            eventOwner.events[i].checkedIn++;
                            event.save().then(() => {
                                res.statusCode = 200;
                                res.json({"message": "Successfull Check In"});
                            }).catch((err) => next(err))
                        }
                    }
                }).catch((err) => next(err))
            }).catch((err) => next(err))
    }).catch((err) => {
        res.statusCode = 403;
        res.json(err)
    })
})

module.exports = verifyTicket