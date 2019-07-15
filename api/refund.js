const jwt = require('jsonwebtoken');
const ShopingOrder = require('../models/shopingOrder');
const ShopAndEarnOrder = require('../models/shopAndEarnOrder');
const User = require('../models/users');
const ShopingCategory = require('../models/shopingCategory');
const shortid = require('shortid');
const https = require('https');
const checksum_lib = require('../paytm-integration/paytm/lib/checksum');
const config = require('../paytm-integration/paytm/config')


const refund = async (req, res) => {
    const orderToken = req.params.orderToken;

    const  decoded = await jwt.verify(orderToken, "This is my secret code for refund process. Its highly complicated");

    let order;

    try {
        order = await ShopingOrder.findById(decoded.orderId);
        if(!order) {
            throw new Error();
        }
    } catch(e) {
        order = await ShopAndEarnOrder.findById(decoded.orderId);       
    }
    
    if(order.paymentMethod == "ikc") {
        await User.findByIdAndUpdate(req.user._id, {
            $inc: {
                'amount': order.amount
            }
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                transactions: {
                    transactionId: shortid.generate(),
                    amount: (req.body.quantity * product.ikcPrice),
                    transactionStatus: 'TXN_SUCCESS',
                    paymentType: 'ikc',
                    detail: "Refund for " + product.title,
                    time: Date.now()
                }
            }
        });
    } else if(order.paymentMethod == "inr") {
        var paytmParams = {};

        paytmParams.body = {

            "mid" : config.MID,
            "txnType" : "REFUND",
            "orderId" : decoded.orderId,
            "txnId" : order.gatewayTransactionId,
            "refId" : shortid.generate(),
            "refundAmount" : order.amount.toString(),
        };

        checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), config.PAYTM_MERCHANT_KEY, function(err, checksum){
            paytmParams.head = {
                "clientId"	: "C11",
                "signature"	: checksum
            };

            var post_data = JSON.stringify(paytmParams);

            var options = {

                /* for Staging */
                hostname: 'securegw-stage.paytm.in',

                /* for Production */
                // hostname: 'securegw.paytm.in',

                port: 443,
                path: '/refund/apply',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            // Set up the request
            var response = "";
            var post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', async function(){
                    await User.findByIdAndUpdate(req.user._id, {
                        $push: {
                            transactions: {
                                transactionId: response.txnId,
                                amount: response.refundAmount,
                                transactionStatus: 'TXN_SUCCESS',
                                paymentType: 'inr',
                                detail: "Refund for " + product.title,
                                time: Date.now()
                            }
                        }
                    });
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });
    }

    order.isRefunded = true;
    await order.save();

    res.send("Product refunded!")
}

module.exports = refund;