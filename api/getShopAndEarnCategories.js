const ShopAndEarnProduct = require('../models/shopAndEarnCategory');

const getShopAndEarnCategories = async (req, res) => {
    const shopAndEarnProducts = await ShopAndEarnProduct.find( {} );
    res.send(shopAndEarnProducts);
}

module.exports = getShopAndEarnCategories;