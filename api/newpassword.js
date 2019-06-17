const express = require('express')
const bodyParser = require('body-parser')

const newPassword = express.Router()
newPassword.use(bodyParser.json())

newPassword.route('/')
.then((req, res, next) => {
    
})