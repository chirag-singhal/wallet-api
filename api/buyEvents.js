const Events = require('../models/events');
const EventOwner = require('../models/eventOwner');
const Users = require('../models/users');
const shortid = require('shortid');
const express = require('express');
const bodyParser = require('body-parser')
const db = require('../firestore')

const buyEvent = express.Router();

buyEvent.use(bodyParser.json());

buyEvent.route('/')
.post((req, res, next) => {
    Events.findById(req.body.eventId).then((event) => {
        Users.findById(req.user._id).then((user) => {
            // console.log(user, "Found")
            EventOwner.findById(event.eventOwner).then((eventOwner) => {
                // console.log(eventOwner.walletId)
                Users.findById(eventOwner.walletId).then(async (eventOwnerWallet) => {
                    const price = parseInt(req.body.quantity) * parseInt(event.cost);
                    if(price > user.amount) {
                        res.statusCode = 403;
                        res.json({"message": "Not enough IKC Balance"});
                    }
                    else {
                        console.log(user.amount)
                        await Users.findByIdAndUpdate(req.user._id, {
                            $inc: {
                                amount: -price
                            }
                        });
                        console.log(user.amount)
                        // Add a new document in collection "cities" with ID 'LA'
                        await db(user.contact, {
                                transactionId: shortid.generate(),
                                amount: -price,
                                name: 'EVENTS',
                                contact: user.contact,
                                transactionStatus: 'TXN_SUCCESS',
                                paymentType: 'ikc',
                                detail: "Bought Event Ticket" + event.name + ' quantity ' + req.body.quantity,
                                time: Date.now()
                            },
                            user.amount - price
                        )
                        user.transactions.push({
                            transactionId: shortid.generate(),
                            amount: -price,
                            name: 'EVENTS',
                            contact: user.contact,
                            transactionStatus: 'TXN_SUCCESS',
                            paymentType: 'ikc',
                            detail: "Bought Event Ticket" + event.name + ' quantity ' + req.body.quantity,
                            time: Date.now()
                        })
                        await user.save();
                        console.log(user.amount)
                        // console.log(eventOwnerWallet)
                        await Users.findByIdAndUpdate(eventOwner.walletId, {
                            $inc: {
                                amount: price
                            }
                        });

                        await db(eventOwnerWallet.contact,
                                {
                                transactionId: shortid.generate(),
                                amount: price,
                                name: 'EVENTS',
                                contact: user.contact,
                                transactionStatus: 'TXN_SUCCESS',
                                paymentType: 'ikc',
                                detail: "Sold Event Ticket" + event.name + ' quantity ' + req.body.quantity,
                                time: Date.now()
                            },
                            eventOwnerWallet.amount + price
                        )
                        eventOwnerWallet.transactions.push({
                            transactionId: shortid.generate(),
                            amount: price,
                            name: 'EVENTS',
                            contact: user.contact,
                            transactionStatus: 'TXN_SUCCESS',
                            paymentType: 'ikc',
                            detail: "Sold Event Ticket" + event.name + ' quantity ' + req.body.quantity,
                            time: Date.now()
                        })
                        let found = false;
                        for(let i = 0; i < user.tickets.length; i++){
                            // console.log(user.tickets[i].eventId)
                            if(user.tickets[i].eventId == req.body.eventId){
                                // console.log("found")
                                found = true;
                                // console.log(user.tickets[i].numberOfTickets)
                                user.tickets[i].numberOfTickets += parseInt(req.body.quantity);
                                // console.log("found")
                                break;
                            }
                        }
                        if(!found){
                            // console.log("Not found")
                            user.tickets.push({
                                eventId: event._id,
                                name: event.name,
                                numberOfTickets: req.body.quantity
                            })
                        }
                        eventOwner.totalEarnings += price;
                        for(var i = 0; i < eventOwner.events.length; i++){
                            if(eventOwner.events[i].eventId == req.body.eventId){
                                eventOwner.events[i].ticketSold += parseInt(req.body.quantity);
                                eventOwner.events[i].earnings += price;
                                break;
                            }
                        }
                        user.save().then((userSaved) => {
                            console.log(userSaved.amount);
                            eventOwner.save().then((eventOwnerSaved) => {
                                // console.log(eventOwnerSaved);
                                eventOwnerWallet.save().then((walletSaved) => {
                                    console.log(walletSaved.amount);
                                    res.statusCode = 200;
                                    res.json({"message": "Tickets bought"});
                                }).catch((err) => next(err))
                            }).catch((err) => next(err))
                        }).catch((err) => next(err))
                    }
                }).catch((err) => next(err))
            }).catch((err) => next(err))
        }).catch((err) => next(err))
    }).catch((err) => {
        res.statusCode = 403;
        res.json(err);
    })
})

module.exports = buyEvent;
