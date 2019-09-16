const express = require('express');
const bodyParser = require('body-parser');

const EventTemp = require('../models/eventsTemp')
const jwt = require('jsonwebtoken');

const addTempEvent = express.Router();
addTempEvent.use(bodyParser.json());

const path = require('path');

const multer = require('multer');
const sharp = require('sharp');

const upload = multer({ 
    dest: __dirname + '/uploads/images',                 // No dest parameter provided because we
    limits: {                                            // do not want to save the image in the 
        fileSize: 10000000                               // filesystem. We wanna access the binary
    },                                                   // data in the router function.
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide a jpg, jpeg or png file'));
        }

        cb(undefined, true);
    }

})

addTempEvent.route('/')
.post(upload.single('image'), async (req, res, next) => {
    console.log("add temp event");
    EventTemp.create(req.body)
    .then(async (eventTemp) => {
        console.log(req.file)
        const buffer = await sharp(path.join(req.file.destination, req.file.filename)).resize({ width: 250, height:250 }).png().toBuffer()
        console.log(buffer);
        eventTemp.image = buffer;
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