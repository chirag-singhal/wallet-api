const express = require('express')
const bodyParser = require('body-parser')

const Users = require('../models/users')

const getTickets = express.Router();

getTickets.use(bodyParser.json())

getTickets.route('/')
.get((req, res, next) => {
    Users.findById(req.user._id).then((user) => {
        res.statusCode = 200;
        res.json(user.tickets)
    }).catch((err) => {
        res.statusCode = 403
        res.json(err)
    })
})

module.exports = getTickets