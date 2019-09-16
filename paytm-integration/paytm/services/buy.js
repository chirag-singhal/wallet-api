const checksum = require('../lib/checksum');
const config = require('../config');
const ShopAndEarnCategory = require('../../../models/shopAndEarnCategory');
const ShopAndEarnOrder = require('../../../models/shopAndEarnOrder');
const ShopingDeliveryAddress = require('../../../models/shopingDeliveryAddress');
const path = require('path');
const jwt = require('jsonwebtoken');
const https = require('https');
const mongodb = require('mongodb');


const initPayment =  function(req) {
  return new Promise(async (resolve, reject) => {
    const DeliveryAddress = await ShopingDeliveryAddress.findById(req.body.DeliveryAddressId || req.query.DeliveryAddressId);

    const shopAndEarnCategory = await ShopAndEarnCategory.findById(req.body.categoryId || req.query.categoryId);

    const subCategory = await shopAndEarnCategory.subCategories.id(req.body.subCategoryId || req.query.subCategoryId);

    const product = await subCategory.products.id(req.body.productId || req.query.productId);

    if((req.body.quantity || req.query.quantity) > product.stock) {
        return reject("The quantity of " + cartProduct.title + " is currently out of stock!");
    }

    const orderId = new mongodb.ObjectId();

    let paymentObj = {
      ORDER_ID: orderId.toString(),
      CUST_ID: req.user._id,
      // CUST_ID: "CUST001",
      INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE_ID,
      CHANNEL_ID: config.CHANNEL_ID,
      TXN_AMOUNT: ((req.body.quantity || req.query.quantity) * product.inrPrice).toString(),
      MID: config.MID,
      WEBSITE: config.WEBSITE,
      // CALLBACK_URL: config.CALLBACK_URL + "?userId=" + req.user._id + "&DeliveryAddressId=" + req.body.DeliveryAddressId + "&categoryId=" + req.body.categoryId + "&subCategoryId=" + req.body.subCategoryId + "&productId=" + req.body.productId + "&quantity=" + req.body.quantity
      CALLBACK_URL: config.CALLBACK_URL + "?userId=" + "CUST001" + "&DeliveryAddressId=" + req.query.DeliveryAddressId + "&categoryId=" + req.query.categoryId + "&subCategoryId=" + req.query.subCategoryId + "&productId=" + req.query.productId + "&quantity=" + req.query.quantity
    };

    checksum.genchecksum(
      paymentObj,
      config.PAYTM_MERCHANT_KEY,
      (err, result) => {
        if (err) {
          return reject('Error while generating checksum');
        } else {
          return resolve(result);
        }
      }
    );
  });
};

const responsePayment = function(req) {
  return new Promise(async (resolve, reject) => {
    const paytmParams = req.body;
    let paytmChecksum;
    const merchantKey = config.PAYTM_MERCHANT_KEY;

    const isValidChecksum = await checksum.verifychecksum(paytmParams, merchantKey, paytmChecksum);

    if (isValidChecksum) {
      /* prepare JSON string for request */
      const post_data = JSON.stringify(paytmParams);

      const options = {
        /* for Staging */
        hostname: 'securegw-stage.paytm.in',
        /* for Production */
        // hostname: 'securegw.paytm.in',
        port: 443,
        path: '/order/status',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': post_data.length
      }
    };

    // Set up the request
    let response = "";
    const post_req = https.request(options, async function (post_res) {
      post_res.on('data', function (chunk) {
        response += chunk;
      });

      post_res.on('end',async function(){
        response = JSON.parse(response);
        if(response.STATUS === "TXN_SUCCESS") {
          const DeliveryAddress = await ShopingDeliveryAddress.findById(req.query.DeliveryAddressId);

          const shopAndEarnCategory = await ShopAndEarnCategory.findById(req.query.categoryId);

          const subCategory = await shopAndEarnCategory.subCategories.id(req.query.subCategoryId);

          const product = await subCategory.products.id(req.query.productId);

          const shopAndEarnOrder = new ShopAndEarnOrder({
              _id: new mongodb.ObjectId(response.ORDERID),
              // userId: req.query.userId,
              product,
              DeliveryAddress,
              amount: response.TXNAMOUNT,
              quantity: (req.query.quantity),
              categoryId: req.query.categoryId,
              subCategoryId: req.query.subCategoryId,
              productId: req.query.productId,
              paymentMethod: "inr",
              gatewayTransactionId: response.TXNID,
              gatewayTransactionStatus: response.STATUS,
              orderDate: Date.now()
          });
          await shopAndEarnOrder.save().then(async () => {
              shopAndEarnOrder.deliveredUrl = path.join(req.headers.host, "/delivered/", jwt.sign({orderId: shopAndEarnOrder._id}, "This is my secret code for refund process. Its highly complicated"));
              await shopAndEarnOrder.save();
          });

          return resolve("Order successfully placed!");
        } else if(response.STATUS === "TXN_FAILURE") {
            return reject("Transaction failed and order cancelled")
        } else if(response.STATUS === "PENDING") {
          const DeliveryAddress = await ShopingDeliveryAddress.findById(req.query.DeliveryAddressId);

          const shopAndEarnCategory = await ShopAndEarnCategory.findById(req.query.categoryId);

          const subCategory = await shopAndEarnCategory.subCategories.id(req.query.subCategoryId);

          const product = await subCategory.products.id(req.query.productId);

          const shopAndEarnOrder = new ShopAndEarnOrder({
              _id: new mongodb.ObjectId(response.ORDERID),
              userId: req.query.userId,
              product,
              DeliveryAddress,
              amount: response.TXNAMOUNT,
              quantity: (req.query.quantity),
              categoryId: req.query.categoryId,
              subCategoryId: req.query.subCategoryId,
              productId: req.query.productId,
              paymentMethod: "inr",
              gatewayTransactionId: response.TXNID,
              gatewayTransactionStatus: response.STATUS,
              orderDate: Date.now()
          });
          await shopAndEarnOrder.save().then(async () => {
              shopAndEarnOrder.deliveredUrl = path.join(req.headers.host, "/delivered/", jwt.sign({orderId: shopAndEarnOrder._id}, "This is my secret code for refund process. Its highly complicated"));
              await shopAndEarnOrder.save();
          });

          return resolve("Transaction pending");
        }
      });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

    } else {
      return reject("Checksum mismatch!");
    }
  });
};

module.exports = {
  initPayment: initPayment,
  responsePayment: responsePayment
};
