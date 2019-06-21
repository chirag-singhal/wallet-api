const DiliveryAddress = require('../model/shopingDiliveryAddress');

const addShopingDiliveryAddress = (req, res) => {
    const diliveryAddress = new DiliveryAddress({
        ...req.body,
        userId: req.user._id
    });

    diliveryAddress.save().then(() => {
        res.send("Address successfully added!");
    }).catch((e) => {
        console.log(e);
        res.status(500).send(e);
    })
}

module.exports = addShopingDiliveryAddress;