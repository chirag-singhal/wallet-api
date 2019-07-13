const checksum = require('../lib/checksum');
const config = require('../config');
const WalletAdd = require('../../../models/walletAdd');
const User = require('../../../models/users');
const https = require('https');
const mongodb = require('mongodb');


const initAdd =  function(req) {
  return new Promise(async (resolve, reject) => {
    

    const orderId = new mongodb.ObjectId();

    let paymentObj = {
      ORDER_ID: orderId.toString(),
      CUST_ID: req.user._id,
      // CUST_ID: "5d24421f41f820200d125c5d",
      INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE_ID,
      CHANNEL_ID: config.CHANNEL_ID,
      TXN_AMOUNT: req.body.amount.toString(),
      // TXN_AMOUNT: req.query.amount.toString(),
      MID: config.MID,
      WEBSITE: config.WEBSITE,
      CALLBACK_URL: config.CALLBACK_URL + "?userId=" + req.user._id
      // CALLBACK_URL: config.CALLBACK_URL_ADD + "?userId=" + "5d24421f41f820200d125c5d"
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

const responseAdd = function(req) {
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
            const walletAdd = new WalletAdd({
                _id: new mongodb.ObjectId(response.ORDERID),
                transactionId: response.TXNID,
                transactionStatus: response.STATUS,
                amount: response.TXNAMOUNT,
                transactionDate: Date.now(),
                userId: new mongodb.ObjectId(req.query.userId)
            });
            await walletAdd.save();

            await User.findByIdAndUpdate(req.query.userId, {
                $inc: {
                    amount: response.TXNAMOUNT
                }
            });

            return resolve("Amount successfully added!");
        } else if(response.STATUS === "TXN_FAILURE") {
            return reject("Transaction failed")
        } else if(response.STATUS === "PENDING") {
            const walletAdd = new WalletAdd({
                _id: new mongodb.ObjectId(response.ORDERID),
                transactionId: response.TXNID,
                transactionStatus: response.STATUS,
                amount: response.TXNAMOUNT,
                transactionDate: Date.now(),
                userId: new mongodb.ObjectId(req.query.userId)
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
  initAdd: initAdd,
  responseAdd: responseAdd
};