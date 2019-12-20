const express = require('express');
const bodyParser = require('body-parser');

const EventOwner = require('../models/ShopVendor')

const addEventVendor = express.Router();
addEventVendor.use(bodyParser.json());

addEventVendor.route('/')
.post((req, res, next) => {
    EventOwner.create(req.body)
    .then((eventOwner) => {
            console.log(eventOwner, "EVENT VENDOR")
            res.statusCode = 200;
            res.json({"message": "Event Vendor Created"})
        }).catch((err) => {
              console.log(err)
                res.statusCode = 403;
                res.json(err);
    })
})

module.exports = addEventVendor