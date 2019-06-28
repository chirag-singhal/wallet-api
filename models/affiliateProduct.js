const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    title: {
        type: String
    },
    vendor: {
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
    ikc: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String
    },
    noOfStockSold: {
        type: Number
    }
})

const AffiliateProductSchema = new mongoose.Schema({
    isAmazonProduct: {
        type: Boolean
    },
    amazonTemplate: {
        type: String
    },
    product: {
        type: Product
    }
});

const AffiliateProduct = mongoose.model('AffiliateProduct', AffiliateProductSchema);


// const affiliateProduct = new AffiliateProduct({
//     isAmazonProduct: true,
//     amazonTemplate: '<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-in.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=IN&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ikcdeal-21&marketplace=amazon&region=IN&placement=B07HLNGL6R&asins=B07HLNGL6R&linkId=0698c2025c43eb79a38e7ba3654ea880&show_border=false&link_opens_in_new_window=true&price_color=0fe4f7&title_color=bf000d&bg_color=ffffff"></iframe>'
// });
// affiliateProduct.save().then(() => {
//     console.log(affiliateProduct);
// }).catch((e) => {
//     console.log(e);
// });

// const affiliateProduct = new AffiliateProduct({
//     isAmazonProduct: false,
//     product: {
//         title: "Tab-1",
//         vendor: "Anonymous Vendor",
//         price: 15000,
//         discount: 0,
//         description: "This is a testing product.",
//         ikc: 150,
//         imageUrl: "../images/tab-1.jpg",
//         noOfStockSold: 0
//     }
// });
// affiliateProduct.save().then(() => {
//     console.log(affiliateProduct);
// }).catch((e) => {
//     console.log(e);
// });


module.exports = AffiliateProduct;