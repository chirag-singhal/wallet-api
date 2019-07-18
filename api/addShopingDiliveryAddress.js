const DiliveryAddress = require('../models/shopingDiliveryAddress');

const addShopingDiliveryAddress = (req, res) => {
    DiliveryAddress.findOne({userId: req.user._id})
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
    })
}

module.exports = addShopingDiliveryAddress;