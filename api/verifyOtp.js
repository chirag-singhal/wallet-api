const Otp = require('../models/otp')

const verifyOtp = ((contact, otps, callback) => {
        Otp.findOne({"contact": contact})
        .then((otp) => {
            const time = new Date()
            time.setSeconds(time.getSeconds() - 300)
            if(otp.updatedAt > time ){
                console.log(otp)
                    console.log(otps)
                    if(otp.otp == otps){
                    console.log(otps)
                    console.log(true)
                    callback(true)
                }
                else{
                    console.log(false)
                    callback(false)
                }
            }
            else{
                    console.log(false,"2")
                    callback(false)
            }
        })
        .catch((err) => {
                    console.log(false,"3")
                    console.log(err)
                    callback(false)
        })
})

module.exports = verifyOtp