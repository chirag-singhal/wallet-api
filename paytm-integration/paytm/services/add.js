const checksum = require('../lib/checksum');
const config = require('../config');
const WalletAdd = require('../../../models/walletAdd');
const User = require('../../../models/users');
const https = require('https');
const mongodb = require('mongodb');


const initAdd =  function(req) {
  return new Promise(async (resolve, reject) => {
    

    const orderId = new mongodb.ObjectId();
    console.log(req.user)
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
      CALLBACK_URL: config.CALLBACK_URL_ADD + "?ORDER_ID=" + orderId
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
    console.log(req.body)
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
          console.log(response)
            const walletAdd = new WalletAdd({
                _id: new mongodb.ObjectId(response.ORDERID),
                transactionId: response.TXNID,
                transactionStatus: response.STATUS,
                amount: response.TXNAMOUNT,
                name: 'Paytm',
                contact: req.user.contact,
                transactionDate: Date.now(),
                userId: new mongodb.ObjectId(req.user._id)
            });
            await walletAdd.save();

            await User.findByIdAndUpdate(req.user._id, {
              $push: {
                  transactions: {
                      transactionId: new mongodb.ObjectId(response.ORDERID),
                      transactionStatus: response.STATUS,
                      amount: response.TXNAMOUNT,
                      paymentType: 'inr',
                      name: 'Paytm',
                      contact: req.user.contact,
                      detail: "Added " + response.TXNAMOUNT + " OrderId: " + response.ORDERID,
                      time: Date.now()
                  }
                }
            });

            await User.findByIdAndUpdate(req.user._id, {
                $inc: {
                    amount: response.TXNAMOUNT
                }
            });

            return resolve("Amount successfully added!");
        } else if(response.STATUS === "TXN_FAILURE") {
            await User.findByIdAndUpdate(req.user._id, {
              $push: {
                  transactions: {
                      transactionId: new mongodb.ObjectId(response.ORDERID),
                      transactionStatus: response.STATUS,
                      amount: response.TXNAMOUNT,
                      name: 'Paytm',
                      contact: req.user.contact,
                      paymentType: 'inr',
                      detail: "Added " + response.TXNAMOUNT + " OrderId: " + response.ORDERID,
                      time: Date.now()
                  }
                }
            });
            return reject("Transaction failed")
        } else if(response.STATUS === "PENDING") {
            await User.findByIdAndUpdate(req.user._id, {
              $push: {
                  transactions: {
                      transactionId: new mongodb.ObjectId(response.ORDERID),
                      transactionStatus: response.STATUS,
                      amount: response.TXNAMOUNT,
                      paymentType: 'inr',
                      name: 'Paytm',
                      contact: req.user.contact,
                      detail: "Added " + response.TXNAMOUNT + " OrderId: " + response.ORDERID,
                      time: Date.now()
                  }
                }
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
