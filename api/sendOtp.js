const Otp = require('../models/otp')
const https = require('https')

const accountSid = 'ACe92d7e192048506640fc843f6b77e1bf'; // Your Account SID from www.twilio.com/console
const authToken = '1d68ddf556166ccc1a0e18c3d0482dc0';   // Your Auth Token from www.twilio.com/console

const apiKey = '+CkeFIiyN/I-rrs1uRIH6XBJUxEYiSSiu14KuTHcns'
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const sender = 'ikcdel'
const authkey = '10703APwDdCpscSPz5c43753d'

const validOptions = { apikey: '%2BCkeFIiyN%2FI-rrs1uRIH6XBJUxEYiSSiu14KuTHcns' };
const tl = require('textlocal')(validOptions);

const sendOTP = (contact, countrycode, callback) => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    const body = `Your otp to register in IKC is :  ${otp}`
    
    // const url = `https://sms.spada.in/api/sendhttp.php?authkey=${authkey}&mobiles=${contact},${countrycode}${contact}&message=${body}&sender=${sender}&route=4&response=json`
    const url = `https://api.txtlocal.com/send/?apikey=${apiKey}&numbers=${countrycode}${contact}&message=${encodeURI(body)}&sender=IKC_DEAL`
    console.log(url)
    console.log(contact)
    Otp.findOne({ "contact": contact })
        .then((OTP) => {
            if (OTP != null) {
                console.log("FOUND OTP");

                OTP.otp = otp
                OTP.save()
                    .then(() => {
                        
                        // tl.sendSMS(contact, body, 'IKC-DEAL', function (err, data) {
                        //     console.log(data)
                        //     if(err) {
                        //         console.log(err, data, 'ERROR')
                        //         callback(false)
                        //     }
                        // });
                        // client.messages.create({
                        //     body: `${body}`,
                        //     to: `+${countrycode}${contact}`,  // Text this number
                        //     from: '+12025176881' // From a valid Twilio number
                        // })
                        // .then((message) => console.log(message.sid));
                        // console.log("OTP SEND")
                        // callback(true)
                        https.get(url,{rejectUnauthorized:false}, (resp) => {
                            let data = '';
                            resp.on('data', (chunk) => {
                                data += chunk;
                            });
                            resp.on('end', () => {
                                console.log(JSON.parse(data), "DATA");
                                data = JSON.parse(data)
                                if(data.status == 'failure')
                                    callback(true)
                            });
                        }).on("error", (err) => {
                            console.log("Error: " + err.message);
                            next(err);
                            callback(false)
                        });


                    })
                    .catch((err) => {
                        console.log(err)
                        callback(false)
                    })
            }
            else {
                console.log("OTP CREATED");

                Otp.create({
                    "contact": contact,
                    "otp": otp
                })
                    .then(() => {
                        console.log("OTP SEND create")
                        callback(true)
                    })
                    .catch((err) => {
                        console.log(err)
                        callback(false)
                    })
            }
        })
        .catch((err) => {
            console.log(err)
            callback(false)
        })

    //       })

    //     resp.on('end', () => {
    //         console.log(JSON.parse(data));
    //     });
    // })
    // .on("error", (err) => {
    //     console.log("Error: " + err.message);
    //     callback(false)
    // });
}

module.exports = sendOTP

