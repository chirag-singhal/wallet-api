const getCartProducts = async (req, res) => {
    try {
        await req.user.populate('cartProducts').execPopulate();
        res.json(req.user.cartProducts);
    } catch(e) {
        res.status(500).send(e);
    }
}

module.exports = getCartProducts;