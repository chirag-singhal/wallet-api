const mongoose = require('mongoose');

const ShopVendorImageSchema = new mongoose.Schema({
    shopVendorId:{
        type: mongoose.Schema.Types.ObjectId
    },
    image: {
        type: Buffer
    }
})

const shopvendorImage = mongoose.model('shopvendorImage', ShopVendorImageSchema)
module.exports = shopvendorImage