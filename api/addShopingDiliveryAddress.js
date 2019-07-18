const DiliveryAddress = require('../models/shopingDiliveryAddress');

const addShopingDiliveryAddress = (req, res) => {
    const diliveryAddress = new DiliveryAddress({
        ...req.body,
        phone1: req.user.contact,
        userId: req.user._id
    });

    diliveryAddress.save().then(() => {
        res.json({"message": "Address successfully added!"});
    }).catch((e) => {
        console.log(e);
        res.status(500).send(e);
    })
}

module.exports = addShopingDiliveryAddress;