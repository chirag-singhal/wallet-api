const mongoose = require('mongoose');

const product = new mongoose.Schema({
    title: String,
    price: Number,
    discount: Number,
    description: String 
});

const SubCategory = new mongoose.Schema({
    title: {
        type: String,
    },
    products: {
        type: [product]
    }
});

const Category = mongoose.model('Categories', {
    title: {
        type: String,
        required: true
    },
    subCategories: {
        type: [SubCategory]
    }
});


// const category = new Category({
//     title: "Women",
//     subCategories: [
//         {
//             title: "Dupatta",
//             products: [
//                 {
//                     title: "Dupatta-1",
//                     price: 699,
//                     discount: 0,
//                     description: "This  is some random shit for Dupatta-1."
//                 },
//                 {
//                     title: "Dupatta-2",
//                     price: 549,
//                     discount: 0,
//                     description: "This  is some random shit for Dupatta-2."
//                 }
//             ]
//         },
//         {
//             title: "Suit",
//             products: [
//                 {
//                     title: "Suit-1",
//                     price: 520,
//                     discount: 0,
//                     description: "This  is some random shit for Suit-1."
//                 },
//                 {
//                     title: "Suit-2",
//                     price: 449,
//                     discount: 0,
//                     description: "This  is some random shit for Suit-2."
//                 }
//             ]
//         },
//         {
//             title: "kurti",
//             products: [
//                 {
//                     title: "Kurti-1",
//                     price: 360,
//                     discount: 0,
//                     description: "This  is some random shit for Kurti-1."
//                 },
//                 {
//                     title: "Kurti-2",
//                     price: 749,
//                     discount: 0,
//                     description: "This  is some random shit for Kurti-2."
//                 }
//             ]
//         },
//         {
//             title: "Saree",
//             products: [
//                 {
//                     title: "Saree-1",
//                     price: 0,
//                     discount: 0,
//                     description: "This  is some random shit for Saree-1."
//                 },
//                 {
//                     title: "Saree-2",
//                     price: 1450,
//                     discount: 0,
//                     description: "This  is some random shit for Saree-2."
//                 }
//             ]
//         }
//     ]
// })

// category.save().then(() => {
//     console.log(category);
// }).catch((e) => {
//     console.log(e);
// });


module.exports = Category;