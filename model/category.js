const mongoose = require('mongoose');

const Category = mongoose.model('Categories', {
    name: {
        type: String,
        required: true
    }
});


module.exports = Category;