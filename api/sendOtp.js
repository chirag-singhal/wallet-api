const Otp = require('../models/otp')
const https = require('https')


const sender = 'ikcdel'
const authkey = '10703APwDdCpscSPz5c43753d'

const sendOTP = (contact, countrycode, callback) => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    const body = `Your otp to register in IKC is :  ${otp}`
    const url = `https://sms.spada.in/api/sendhttp.php?authkey=${authkey}&mobiles=${contact},${countrycode}${contact}&message=${body}&sender=${sender}&route=4&response=json`

    https.get(url,{rejectUnauthorized:false}, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;

            Otp.findOne({contact: contact}).exec()
            .then((OTP) => {
                if(OTP != null){
                    OTP.otp = otp
                    OTP.save()
                    .then(() => {
                        console.log("OTP SEND")
                        callback(true)
                    })
                    .catch((err) => {
                        console.log(err)
                        callback(false)
                    })
                }
                else{
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
            
          });
        
        resp.on('end', () => {
            console.log(JSON.parse(data));
        });
    })
    .on("error", (err) => {
        console.log("Error: " + err.message);
        callback(false)
    });
}

module.exports = sendOTP

