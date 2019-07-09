const checksumLib = require('../paytm/checksum');

const verifyCheckSumHash = (req, res) => {
    const paytmParams = req.body;
    let paytmChecksum;
    const merchantKey = "7UmP2Y0oMdF1dmnj";

    if(paytmParams.CHECKSUMHASH) {
        paytmChecksum = paytmParams.CHECKSUMHASH;
        delete paytmParams.CHECKSUMHASH;
    }

    const isValidChecksum = checksumLib.verifychecksum(paytmParams, merchantKey, paytmChecksum);
    if (isValidChecksum) {
            paytmParams["CHECKSUMHASH"] = paytmChecksum;
        
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
            const post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });
        
                post_res.on('end', function(){
                    console.log(response);
                    // if(response.STATUS == "TXN_SUCCESS") {

                    // } else if(response.STATUS == "TXN_FAILURE") {
                        
                    // } else if(response.STATUS == "PENDING") {

                    // }
                });
            });
        
            // post the data
            post_req.write(post_data);
            post_req.end();

    } else {
        res.send("Checksum MisMatch");
    }
}

module.exports = verifyCheckSumHash;