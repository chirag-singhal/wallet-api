const Category = require('../model/category');

const getCategories = (req, res) => {
    Category.find({}).then((categories) => {
        res.send(categories)
    }).catch((e) => {
        res.status(500).send(e);
    });
}

module.exports = getCategories;