const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    },
    stock: {
        type: Number
    },
    isReplaceable: {
        type: Boolean
    },
    isRefundable: {
        type: Boolean
    }
});

const SubCategory = new mongoose.Schema({
    title: {
        type: String,
    },
    products: {
        type: [Product]
    }
});

const Category = mongoose.model('categories', {
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
//                     description: "This  is some random shit for Dupatta-1.",
//                     imageUrl: "../images/RBF-SNC-25D-600x600.gif"
//                 },
//                 {
//                     title: "Dupatta-2",
//                     price: 549,
//                     discount: 0,
//                     description: "This  is some random shit for Dupatta-2.",
//                     imageUrl: "../images/RBF-BAL-03A-600x600.jpg"
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
//                     description: "This  is some random shit for Suit-1.",
//                     imageUrl: "../images/RBF-SUT-05-600x600.jpg"
//                 },
//                 {
//                     title: "Suit-2",
//                     price: 449,
//                     discount: 0,
//                     description: "This  is some random shit for Suit-2.",
//                     imageUrl: "../images/RBF-SUT-04-600x600.jpg"
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
//                     description: "This  is some random shit for Kurti-1.",
//                     imageUrl: "../images/RBF-SUT-03A-600x600.jpg"
//                 },
//                 {
//                     title: "Kurti-2",
//                     price: 749,
//                     discount: 0,
//                     description: "This  is some random shit for Kurti-2.",
//                     imageUrl: "../images/RBF-KUR-04a-600x600.jpg"
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
//                     description: "This  is some random shit for Saree-1.",
//                     imageUrl: "../images/RBF-SAR-PINK-01-600x600.gif"
//                 },
//                 {
//                     title: "Saree-2",
//                     price: 1450,
//                     discount: 0,
//                     description: "This  is some random shit for Saree-2.",
//                     imageUrl: "../images/Saree-Red-600x600.gif"
//                 }
//             ]
//         }
//     ]
// });
// category.save().then(() => {
//     console.log(category);
// }).catch((e) => {
//     console.log(e);
// });


module.exports = Category;