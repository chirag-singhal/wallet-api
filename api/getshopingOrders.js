const getShopingOrder = async (req, res) => {
    try {
        await req.user.populate('shopingOrder').execPopulate();
        res.send(req.user.shopingOrder);
    } catch(e) {
        res.status(500).send(e);
    }
}

module.exports = getShopingOrder;