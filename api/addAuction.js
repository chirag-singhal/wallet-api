const express = require('express');
const bodyParser = require('body-parser');

const Auction = require('../models/auctionProducts')

const addAuction = express.Router();
addAuction.use(bodyParser.json());

const path = require('path');

const multer = require('multer');
const sharp = require('sharp');

const AuctionVendor = require('../models/auctionVendor')

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


addAuction.route('/')
.post(upload.single('image'), async (req, res, next) => {
    Auction.create(req.body)
    .then(async (auction) => {
        console.log(auction)
        console.log(req.file)
        const buffer = await sharp(path.join(req.file.destination, req.file.filename)).resize({ width: 250, height:250 }).png().toBuffer()
        console.log(buffer);
        auction.imageUrl = buffer;
        auction.auctionCreator = req.user._id;
        auction.save().then(async (auctionWithCreator) => {
            const auctionVendor = await AuctionVendor.findById(req.user._id);
            console.log(auctionVendor, "auction")
            auctionVendor.auctions.push({
                ...req.body,
                auctionId: auction._id
            })
            await auctionVendor.save();
            console.log(auction)
            res.statusCode = 200;
            res.json({"message": "Auction Created"})
        }).catch((err) => next(err))
    }).catch((err) => {
        console.log(err)
        res.statusCode = 403;
        res.json(err);
    })
})

module.exports = addAuction