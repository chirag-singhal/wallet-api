const AffiliateProduct = require('../model/affiliateProduct');

const getAffiliateProduct = (req, res) => {
    AffiliateProduct.find( {} ).then((products) => {
        res.send(products);
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });
}

module.exports = getAffiliateProduct;