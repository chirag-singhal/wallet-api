const mongoose = require('mongoose');

const AffiliateProductSchema = new mongoose.Schema({
    template: {
        type: String
    }
});

const AffiliateProduct = mongoose.model('AffiliateProduct', AffiliateProductSchema);


// const affiliateProduct = new AffiliateProduct({
//     template: '<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-in.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=IN&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ikcdeal-21&marketplace=amazon&region=IN&placement=B07HLNGL6R&asins=B07HLNGL6R&linkId=0698c2025c43eb79a38e7ba3654ea880&show_border=false&link_opens_in_new_window=true&price_color=0fe4f7&title_color=bf000d&bg_color=ffffff"></iframe>'
// });
// affiliateProduct.save().then(() => {
//     console.log(affiliateProduct);
// }).catch((e) => {
//     console.log(e);
// });


module.exports = AffiliateProduct;