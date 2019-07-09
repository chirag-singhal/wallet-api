const ShopAndEarnCategory = require('../models/shopAndEarnCategory');
const ShopingDiliveryAddress = require('../models/shopingDiliveryAddress');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');
const checksumLib = require('../paytm/checksum');
const https = require('https');

const buyWithInr = async (req, res) => {
    // const diliveryAddress = await ShopingDiliveryAddress.findById(req.body.diliveryAddressId);

    // const shopAndEarnCategory = await ShopAndEarnCategory.findById(req.body.categoryId);

    // const subCategory = await shopAndEarnCategory.subCategories.id(req.body.subCategoryId);

    // const product = await subCategory.products.id(req.body.productId);

    // if(req.body.quantity > product.stock) {
    //     return res.status(500).send("The quantity of " + cartProduct.title + " is currently out of stock!");
    // }

    // const shopAndEarnOrder = new ShopAndEarnOrder({
    //     userId: req.user._id,
    //     product,
    //     diliveryAddress,
    //     amount: req.body.quantity * product.inrPrice,
    //     quantity: req.body.quantity,
    //     categoryId: req.body.categoryId,
    //     subCategoryId: req.body.subCategoryId,
    //     productId: req.body.productId,
    //     paymentMethod: "inr"
    // });
    // await shopAndEarnOrder.save().then(async () => {
    //     shopAndEarnOrder.diliveredUrl = path.join(req.headers.host, "/dilivered/", jwt.sign({orderId: shopAndEarnOrder._id}, "This is my secret code for refund process. Its highly complicated"));
    //     await ShopAndEarnOrder.updateOne({ _id: shopAndEarnOrder._id }, { $currentDate: {
    //             orderDate: true
    //         }
    //     });
    //     await shopAndEarnOrder.save();
    // });

    const paytmParams = {};
    const merchantKey = '7UmP2Y0oMdF1dmnj';
    paytmParams["MID"] = 'FMeRvs93987018477619';
    // paytmParams["ORDER_ID"] = shopAndEarnOrder._id;
    paytmParams["ORDER_ID"] = 'order0001';
    paytmParams["INDUSTRY_TYPE_ID"] = 'Retail';
    // paytmParams["TXN_AMOUNT"] = req.body.quantity * product.inrPrice;
    paytmParams["TXN_AMOUNT"] = '1.00';
    paytmParams["TXN_TYPE"] = 'WITHDRAW'
    paytmParams["WEBSITE"] = 'WEBSTAGING';
    // paytmParams["CUST_ID"] = req.user._id;
    paytmParams["CUST_ID"] = 'cust0001';
    paytmParams["CHANNEL_ID"] = 'WEB';
    paytmParams["CALLBACK_URL"] = 'http://' + req.headers.host + '/verifyCheckSumHash';
    // paytmParams["EMAIL"] = req.user.email;
    // paytmParams["MOBILE_NO"] = req.user.contact;

    const transactionURL = 'https://securegw-stage.paytm.in/theia/processTransaction';
    // for production 
    // const transactionURL = "https://securegw.paytm.in/theia/processTransaction"; 

    await checksumLib.genchecksumbystring(paytmParams, merchantKey, async (err, checksum) => {
        if(err) {
            return res.send("Something went wrong!", err);
        }

        let outputHTML = "<html>";
        outputHTML += "<head>";
        outputHTML += "<title>Merchant Checkout Page</title>";
        outputHTML += "</head>";
        outputHTML += "<body>";
        outputHTML += "<center><h1>Please do not refresh this page...</h1></center>";
        outputHTML += "<form method='post' action='" + transactionURL + "' name='f1'>";
        const paytmParamsKey = Object.keys(paytmParams);
        const paytmParamsValue = Object.values(paytmParams);
        for (i = 0; i < paytmParamsKey.length; i++) {
            outputHTML += "<input type='hidden' name='" + paytmParamsKey[i] + "' value='" + paytmParamsValue[i] + "'>";
        }
        outputHTML += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "'>";
        outputHTML += "</form>";
        outputHTML += "<script>document.f1.submit();</script>";
        outputHTML += "</body>";
        outputHTML += "</html>";
        res.send(outputHTML);



    //     paytmParams["CHECKSUMHASH"] = checksum;

    //     /* prepare JSON string for request */
    //     var post_data = JSON.stringify(paytmParams);

    //     var options = {

    //         /* for Staging */
    //         hostname: 'securegw-stage.paytm.in',

    //         /* for Production */
    //         // hostname: 'securegw.paytm.in',

    //         port: 443,
    //         path: '/order/status',
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Content-Length': post_data.length
    //         }
    //     };

    //     // Set up the request
    //     var response = "";
    //     var post_req = https.request(options, function(post_res) {
    //         post_res.on('data', function (chunk) {
    //             response += chunk;
    //         });

    //         post_res.on('end', function(){
    //             console.log('Response: ', response);
    //         });
    //     });

    //     // post the data
    //     post_req.write(post_data);
    //     post_req.end();
    });
}

module.exports = buyWithInr;