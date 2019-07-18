const AffiliateProduct = require('../models/affiliateProduct');

const getAffiliateProduct = (req, res) => {
    AffiliateProduct.find( {} ).then((products) => {
        res.json(products);
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });
}

module.exports = getAffiliateProduct;