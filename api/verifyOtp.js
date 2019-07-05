const express = require('express')
const bodyParser = require('body-parser')


const Otp = require('../models/otp')

const verifyOtp = express.Router();
verifyOtp.use(bodyParser.json())

verifyOtp.route('/')
.post((req, res) => {
    if(req.body.contact && req.body.otp){
        Otp.findOne({"contact": req.body.contact}).exec()
        .then((otp) => {
            const time = new Date()
            time.setSeconds(time.getSeconds() - 300)
            if(otp.updatedAt > time ){
                if(otp.otp == req.body.otp){

                    res.statusCodeCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: true,
                        message: "OTP verified"
                      });
                }
                else{
                    res.statusCode = 403
                    console.log("wrong otp")
                    res.setHeader('Content-Type', 'application/json')
                    res.end("Wrong OTP")
                }
            }
            else{
                res.statusCode = 403
                res.setHeader('Content-Type', 'application/json')
                console.log("otp expired")
                res.end("OTP expired")
            }
        })
        .catch((err) => {
            res.statusCode = 403
            res.setHeader('Content-Type', 'application/json')
            res.json(err)
        })
    }
    else{
        res.statusCode = 403
        res.setHeader('Content-Type', 'application/json')
        res.end("Missing Fields")
    }
})

module.exports = verifyOtp