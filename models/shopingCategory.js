const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    title: {
        type: String
    },
    ikcPrice: {
        type: Number
    },
    inrPrice: {
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

const Category = mongoose.model('categories', {
    title: {
        type: String,
        required: true
    },
    products: {
        type: [Product]
    }
});


// const category = new Category({
//     title: "E-talent",
//     products: [
//         {
//             title: "Dupatta-1",
//             ikcPrice: 699,
//             discount: 0,
//             description: "This  is some random shit for Dupatta-1.",
//             imageUrl: "../images/RBF-SNC-25D-600x600.gif",
//             stock: 5,
//             isReplaceable: true,
//             isRefundable: true
//         },
//         {
//             title: "Dupatta-2",
//             ikcPrice: 549,
//             discount: 0,
//             description: "This  is some random shit for Dupatta-2.",
//             imageUrl: "../images/RBF-BAL-03A-600x600.jpg",
//             stock: 5,
//             isReplaceable: true,
//             isRefundable: true
//         },
//         {
//             title: "Suit-1",
//             ikcPrice: 520,
//             discount: 0,
//             description: "This  is some random shit for Suit-1.",
//             imageUrl: "../images/RBF-SUT-05-600x600.jpg",
//             stock: 5,
//             isReplaceable: true,
//             isRefundable: true
//         },
//         {
//             title: "Suit-2",
//             ikcPrice: 449,
//             discount: 0,
//             description: "This  is some random shit for Suit-2.",
//             imageUrl: "../images/RBF-SUT-04-600x600.jpg",
//             stock: 5,
//             isReplaceable: true,
//             isRefundable: true
//         },
//         {
//             title: "Kurti-1",
//             ikcPrice: 360,
//             discount: 0,
//             description: "This  is some random shit for Kurti-1.",
//             imageUrl: "../images/RBF-SUT-03A-600x600.jpg",
//             stock: 5,
//             isReplaceable: true,
//             isRefundable: true
//         },
//         {
//             title: "Kurti-2",
//             ikcPrice: 749,
//             discount: 0,
//             description: "This  is some random shit for Kurti-2.",
//             imageUrl: "../images/RBF-KUR-04a-600x600.jpg",
//             stock: 5,
//             isReplaceable: true,
//             isRefundable: true
//         },
//         {
//             title: "Saree-1",
//             ikcPrice: 0,
//             discount: 0,
//             description: "This  is some random shit for Saree-1.",
//             imageUrl: "../images/RBF-SAR-PINK-01-600x600.gif",
//             stock: 5,
//             isReplaceable: true,
//             isRefundable: true
//         },
//         {
//             title: "Saree-2",
//             ikcPrice: 1450,
//             discount: 0,
//             description: "This  is some random shit for Saree-2.",
//             imageUrl: "../images/Saree-Red-600x600.gif",
//             stock: 5,
//             isReplaceable: true,
//             isRefundable: true
//         }
//     ]
// });
// category.save().then(() => {
//     console.log(category);
// }).catch((e) => {
//     console.log(e);
// });


module.exports = Category;