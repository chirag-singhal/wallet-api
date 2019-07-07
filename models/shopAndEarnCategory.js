const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
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
    noOfStockSold: {
        type: Number,
        default: 0
    },
    isReplaceable: {
        type: Boolean
    },
    isRefundable: {
        type: Boolean
    },
    vendorName: {
        type: String
    }
});

const SubCategorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    products: {
        type: [ProductSchema]
    }
})

const ShopAndEarnCategorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    subCategories: {
        type: [SubCategorySchema]
    }
})

const ShopAndEarnCategory = mongoose.model('ShopAndEarnCategories', ShopAndEarnCategorySchema);

// const shopAndEarnCategory = new ShopAndEarnCategory({
//     title: "Men",
//     subCategories: [
//         {
//             title: "Shirt",
//             products: [
//                 {
//                     title: "Shirt-1",
//                     ikcPrice: 800,
//                     inrPrice: 1000,
//                     discount: 0,
//                     description: "This is some description for shop and earn Shirt-1",
//                     imageUrl: "../images/RBF-SNC-25D-600x600.gif",
//                     stock: 10,
//                     isReplaceable: true,
//                     isRefundable: true
//                 },
//                 {
//                     title: "Shirt-2",
//                     ikcPrice: 500,
//                     inrPrice: 700,
//                     discount: 0,
//                     description: "This is some description for shop and earn Shirt-2",
//                     imageUrl: "../images/RBF-SNC-25D-600x600.gif",
//                     stock: 10,
//                     isReplaceable: true,
//                     isRefundable: true
//                 }
//             ]
//         },
//         {
//             title: "Jeans",
//             products: [
//                 {
//                     title: "Jeans-1",
//                     ikcPrice: 1800,
//                     inrPrice: 2000,
//                     discount: 0,
//                     description: "This is some description for shop and earn Jeans-1",
//                     imageUrl: "../images/RBF-SNC-25D-600x600.gif",
//                     stock: 10,
//                     isReplaceable: true,
//                     isRefundable: true
//                 },
//                 {
//                     title: "Jeans-2",
//                     ikcPrice: 1500,
//                     inrPrice: 1700,
//                     discount: 0,
//                     description: "This is some description for shop and earn Jeans-2",
//                     imageUrl: "../images/RBF-SNC-25D-600x600.gif",
//                     stock: 10,
//                     isReplaceable: true,
//                     isRefundable: true
//                 }
//             ]
//         }
//     ]
// });

// shopAndEarnCategory.save().then(() => {
//     console.log(shopAndEarnCategory);
// }).catch((e) => {
//     console.log(e);
// });

module.exports = ShopAndEarnCategory;