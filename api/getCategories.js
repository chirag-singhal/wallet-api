const ShopingCategory = require('../models/shopingCategory');

const getCategories = (req, res) => {
    ShopingCategory.find({}).then((categories) => {
        res.json(categories)
    }).catch((e) => {
        res.status(500).send(e);
    });
}

module.exports = getCategories;