const express = require('express');
const bodyParser = require('body-parser');

const Categories = require('../models/shopingCategory')
const Image = require('../models/ShopVendorImage');

const addProduct = express.Router();
addProduct.use(bodyParser.json());

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


addProduct.route('/')
.post(upload.single('image'), async (req, res, next) => {
    const categories = await Categories.findOne({"title": "E-talent"})
    const buffer = await sharp(path.join(req.file.destination, req.file.filename)).resize({ width: 250, height:250 }).png().toBuffer()
    
    if(categories) {
        categories.products.push({
            ...req.body,
            imageUrl: buffer,
            shopVendorId: req.user._id,
            offererName: req.user.username,
            offererImage: req.user.image
        })
        await categories.save();
    }
    else {
        await Categories.create({
            title: "E-talent",
            products: [{
                ...req.body,
                imageUrl: buffer,
                shopVendorId: req.user._id,
                offererName: req.user.username,
                offererImage: image.image
            }]
        })
    }
})

module.exports = addProduct