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
        offererId: {
            type: mongoose.Schema.Types.ObjectId
        },
        offererName: {
            type: String
        },
        offererImage: {
            type: String
        },
        isReplaceable: {
            type: Boolean
        },
        isRefundable: {
            type: Boolean
        }
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true 
        }
    });

Product.set('toObject', { getters: true });

const Category = mongoose.model('categories', {
        title: {
            type: String,
            required: true
        },
        products: {
            type: [Product]
        }
    });

Product.virtual('offerers', {
    ref: 'offerer',
    localField: 'offererId',
    foreignField: '_id'
});


const category = new Category({
    title: "E-talent",
    products: [
        {
            title: "Dupatta-1",
            ikcPrice: 699,
            inrPrice: 999,
            discount: 0,
            description: "This  is some random shit for Dupatta-1.",
            imageUrl: "../images/RBF-SNC-25D-600x600.gif",
            stock: 5,
            isReplaceable: true,
            isRefundable: true,
            offererId: '5d2ac52be0d3ad14b114efe2',
            offererName: 'Test Actor',
            offererImage: '../images/RBF-SNC-25D-600x600.gif'
        },
        {
            title: "Dupatta-2",
            ikcPrice: 549,
            inrPrice: 999,
            discount: 0,
            description: "This  is some random shit for Dupatta-2.",
            imageUrl: "../images/RBF-BAL-03A-600x600.jpg",
            stock: 5,
            isReplaceable: true,
            isRefundable: true,
            offererId: '5d2ac52be0d3ad14b114efe2',
            offererName: 'Test Actor',
            offererImage: '../images/RBF-SNC-25D-600x600.gif'
        },
        {
            title: "Suit-1",
            ikcPrice: 520,
            inrPrice: 999,
            discount: 0,
            description: "This  is some random shit for Suit-1.",
            imageUrl: "../images/RBF-SUT-05-600x600.jpg",
            stock: 5,
            isReplaceable: true,
            isRefundable: true,
            offererId: '5d2ac52be0d3ad14b114efe2',
            offererName: 'Test Actor',
            offererImage: '../images/RBF-SNC-25D-600x600.gif'
        },
        {
            title: "Suit-2",
            ikcPrice: 449,
            inrPrice: 999,
            discount: 0,
            description: "This  is some random shit for Suit-2.",
            imageUrl: "../images/RBF-SUT-04-600x600.jpg",
            stock: 5,
            isReplaceable: true,
            isRefundable: true,
            offererId: '5d2ac52be0d3ad14b114efe2',
            offererName: 'Test Actor',
            offererImage: '../images/RBF-SNC-25D-600x600.gif'
        },
        {
            title: "Kurti-1",
            ikcPrice: 360,
            inrPrice: 999,
            discount: 0,
            description: "This  is some random shit for Kurti-1.",
            imageUrl: "../images/RBF-SUT-03A-600x600.jpg",
            stock: 5,
            isReplaceable: true,
            isRefundable: true,
            offererId: '5d2ac52be0d3ad14b114efe2',
            offererName: 'Test Actor',
            offererImage: '../images/RBF-SNC-25D-600x600.gif'
        },
        {
            title: "Kurti-2",
            ikcPrice: 749,
            inrPrice: 999,
            discount: 0,
            description: "This  is some random shit for Kurti-2.",
            imageUrl: "../images/RBF-KUR-04a-600x600.jpg",
            stock: 5,
            isReplaceable: true,
            isRefundable: true,
            offererId: '5d2ac52be0d3ad14b114efe2',
            offererName: 'Test Actor',
            offererImage: '../images/RBF-SNC-25D-600x600.gif'
        },
        {
            title: "Saree-1",
            ikcPrice: 0,
            inrPrice: 999,
            discount: 0,
            description: "This  is some random shit for Saree-1.",
            imageUrl: "../images/RBF-SAR-PINK-01-600x600.gif",
            stock: 5,
            isReplaceable: true,
            isRefundable: true,
            offererId: '5d2ac52be0d3ad14b114efe2',
            offererName: 'Test Actor',
            offererImage: '../images/RBF-SNC-25D-600x600.gif'
        },
        {
            title: "Saree-2",
            ikcPrice: 1450,
            inrPrice: 999,
            discount: 0,
            description: "This  is some random shit for Saree-2.",
            imageUrl: "../images/Saree-Red-600x600.gif",
            stock: 5,
            isReplaceable: true,
            isRefundable: true,
            offererId: '5d2ac52be0d3ad14b114efe2',
            offererName: 'Test Actor',
            offererImage: '../images/RBF-SNC-25D-600x600.gif'
        }
    ]
});
category.save().then(() => {
    console.log(category);
}).catch((e) => {
    console.log(e);
});


module.exports = Category;