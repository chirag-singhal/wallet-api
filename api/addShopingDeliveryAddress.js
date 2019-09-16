const DeliveryAddress = require('../models/shopingDeliveryAddress');

const addShopingDeliveryAddress = (req, res) => {
    DeliveryAddress.findOne({userId: req.user._id})
    .then((address) => {
        if(address != null){
            address.address = req.body.address;
            address.state = req.body.state;
            address.city = req.body.city;
            address.pincode = req.body.pincode;
            address.name = req.body.name;
            address.addressType = req.body.addressType;
            address.save().then(() => {
                res.json({"message": "Address successfully added!"});
            })
            .catch((e) => {
                console.log(e);
                res.status(500).send(e);
            })
        }
        else{
            const DeliveryAddress = new DeliveryAddress({
                ...req.body,
                phone1: req.user.contact,
                userId: req.user._id
            });
            DeliveryAddress.save().then(() => {
                res.json({"message": "Address successfully added!"});
            }).catch((e) => {
                console.log(e);
                res.status(500).send(e);
            })
        }
    })
}

module.exports = addShopingDeliveryAddress;