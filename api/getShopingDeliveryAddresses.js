const getShopingDeliveryAddress = async (req, res) => {
    try {
        await req.user.populate('shopingDeliveryAddress').execPopulate();
        res.json(req.user.shopingDeliveryAddress);
    } catch(e) {
        res.status(500).send(e);
    }
}

module.exports = getShopingDeliveryAddress;