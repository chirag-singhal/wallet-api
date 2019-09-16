const getShopAndEarnOrder = async (req, res) => {
    try {
        await req.user.populate('shopAndEarnOrder').execPopulate();

        const orderObject = req.user.shopAndEarnOrder;
        
        for(i = 0; i < orderObject.length; i++) {
            orderObject[i] = orderObject[i].toObject();
            delete orderObject[i].deliveredUrl;
            delete orderObject[i].pickedUpSuccessfullyReplaceUrl;
            delete orderObject[i].pickedUpUnsuccessfullyReplaceUrl;
            delete orderObject[i].pickedUpSuccessfullyUrl;
            delete orderObject[i].pickedUpUnsuccessfullyUrl;
            delete orderObject[i].refundUrl;
        }


        res.json(orderObject);
    } catch(e) {
        res.status(500).send(e);
    }
}

module.exports = getShopAndEarnOrder;