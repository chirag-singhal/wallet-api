const express = require('express');
const bodyParser = require('body-parser');
const  EventTemp = require('../models/eventsTemp');
const Events = require('../models/events');
const EventOwner = require('../models/eventOwner')
const addEvent = express.Router();
addEvent.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const path = require('path');

const multer = require('multer');
const sharp = require('sharp');

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
            otherInfo: eventTemp.otherInfo,
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
                    otherInfo: eventTemp.otherInfo,
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

addEvent.route('/upload/image')
.post(upload.single('image'), async (req, res, next) => {
    console.log(__dirname);
    console.log(req.file)
    Events.findById(req.body.eventId).then(async (event) => {
        const buffer = await sharp(path.join(req.file.destination, req.file.filename)).resize({ width: 250, height:250 }).png().toBuffer()
        console.log(buffer);
        event.image = req.file.destination;
        await event.save();
        res.send({"message": "Image successfully uploaded"});
    })
    .catch((err) => {
        console.log(err);
        res.statusCode = 403;
        res.json(err)
    })
})

module.exports = addEvent