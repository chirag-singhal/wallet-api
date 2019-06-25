const http = require('http')
const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');

const auth = require('./api/login')
const updatePassword = require('./api/updatePassword')
const updateProfile = require('./api/updateProfile')
const jwtVerify = require('./jwtverify')
const verifyUser = require('./api/verifyUser')
const verifyOtp = require('./api/verifyOtp')
const changePassword = require('./api/changePassword')
const forgotPassword = require('./api/forgotPassword')



const getCategories = require('./api/getCategories');
const addToCart = require('./api/addToCart');
const removeFromCart = require('./api/removeFromCart');
const getCartProducts = require('./api/getCartProducts');
const getAuctionProducts = require('./api/getAuctionProducts');
const placeBid = require('./api/placeBid');
const getAffiliateProduct = require('./api/getAffiliateProduct');
const incrementCartProductQty = require('./api/incrementCartProductQty');
const decrementCartProductQty = require('./api/decrementCartProductQty');
const addShopingDiliveryAddress = require('./api/addShopingDiliveryAddress');
const checkoutShopingCart = require('./api/checkoutShopingCart');
const getShopingDiliveryAddress = require('./api/getShopingDiliveryAddresses');



const app = express()
const url = 'mongodb://localhost:27017/ikc';


// const hostname = 'localhost'
const port = 3000


app.use(express.json());
app.use(morgan('dev'))


// ------------------------------------------------Login & Sign Up----------------------------------------------------------------

app.use('/auth', auth);
app.use('/verifyUser', verifyUser)
app.use('/verifyOtp', verifyOtp)
app.use('/changePassword', changePassword)
app.use('/forgotPassword', forgotPassword)

// ----------------------------------------------------Connect to Database--------------------------------------------------------------------
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const connect = mongoose.connect(url,{useNewUrlParser : true});

connect.then((db) => {
    console.log("connected to database");
}, (err) => {console.log(err);})



// ------------------------------------------------Update Password----------------------------------------------------------------
app.use('/updatePassword', jwtVerify, updatePassword);



// ------------------------------------------------Update Profile----------------------------------------------------------------
app.use('/updateProfile', jwtVerify, updateProfile);



// ------------------------------------------------Shopping Categories Request----------------------------------------------------------------
app.get('/categories', (req, res) => {
    getCategories(req, res);
});



// ----------------------------------------------------Cart Request---------------------------------------------------------------------------
app.post('/cart', jwtVerify, (req, res) => {
    addToCart(req, res);
});

app.delete('/cart', jwtVerify, (req, res) => {
    removeFromCart(req, res);
});

app.get('/cart', jwtVerify, (req, res) => {
    getCartProducts(req, res);
});

app.patch('/incrementCartProductQty', jwtVerify, (req, res) => {
    incrementCartProductQty(req, res);
});

app.patch('/decrementCartProductQty', jwtVerify, (req, res) => {
    decrementCartProductQty(req, res);
});



// ---------------------------------------------------Cart Checkout Requests------------------------------------------------------------------
app.post('/shopingDiliveryAddress', jwtVerify, (req, res) => {
    addShopingDiliveryAddress(req, res); 
});

app.get('/shopingDiliveryAddress', jwtVerify, (req, res) => {
    getShopingDiliveryAddress(req, res);
});

app.post('/checkoutShopingCart', jwtVerify, (req, res) => {
    checkoutShopingCart(req, res);
});



// ----------------------------------------------------Auction Request-------------------------------------------------------------------------
app.get('/auction', (req, res) => {
    getAuctionProducts(req, res);
});

app.post('/auction', jwtVerify, (req, res) => {
    placeBid(req, res);
});



// --------------------------------------------Affiliate Product(Shop & earn)-------------------------------------------------------------------
app.get('/getAffiliateProducts',  (req, res) => {
    getAffiliateProduct(req, res);
});


app.listen(port, () => console.log('Server ready'))