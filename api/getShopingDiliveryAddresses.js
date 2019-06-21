const getShopingDiliveryAddress = async (req, res) => {
    try {
        await req.user.populate('shopingDiliveryAddress').execPopulate();
        res.send(req.user.shopingDiliveryAddress);
    } catch(e) {
        res.status(500).send(e);
    }
}

module.exports = getShopingDiliveryAddress;