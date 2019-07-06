const http = require('http')
const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');





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
const getShopingOrder = require('./api/getshopingOrders');
const cancelBeforeDilivery = require('./api/cancelBeforeDilivery');
const refundShopingOrder = require('./api/refundShopingOrder');
const replaceShopingOrder = require('./api/replaceShopingOrder');
const dilivered = require('./api/dilivered');
const successfullyPickedUpRefund = require('./api/successfullyPickedUpRefund');
const unsuccessfullyPickedUpRefund = require('./api/unsuccessfullyPickedUpRefund');



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

app.post('/shopingOrder', jwtVerify, (req, res) => {
    checkoutShopingCart(req, res);
});

app.get('/shopingOrder', jwtVerify, (req, res) => {
    getShopingOrder(req, res);
});

app.patch('/cancelBeforeDilivery', jwtVerify, (req, res) => {
    cancelBeforeDilivery(req, res);
});

app.patch('/refundShopingOrder', jwtVerify, (req, res) => {
    refundShopingOrder(req, res);
});

app.patch('/replaceShopingOrder', jwtVerify, (req, res) => {
    replaceShopingOrder(req, res);
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



// ----------------------------------------------------Admin Panel--------------------------------------------------------------------------------
AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  branding: {
      companyName: "ikc-deal",
      logo: 'https://lh3.googleusercontent.com/io4lPFkfL4caWaic_I8OYo3ejoW0EMRYkp_RBFP87Ff78E7n1ADevYv1d_xvGgS-fA=s100-rw'
  },
});

const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin@ikc-deal.com',
    password: process.env.ADMIN_PASSWORD || 'ikc-deal-2019'
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: process.env.ADMIN_COOKIE_NAME || 'ikc-deal',
    cookiePassword: process.env.ADMIN_COOKIE_PASS || 'ikc-deal-2019',
    authenticate: async (email, password) => {
        if(email === ADMIN.email && password === ADMIN.password)
            return ADMIN;

        return null;
    },
    softwareBrothers: false
});

app.use('/admin', router);



// ------------------------------------------admin managing requests---------------------------------------
app.get('/dilivered/:orderToken', (req, res) => {
    dilivered(req, res);
});

app.get('/successfullyPickedUpRefund/:orderToken', (req, res) => {
    successfullyPickedUpRefund(req, res);
});

app.get('/unsuccessfullyPickedUpRefund/:orderToken', (req, res) => {
    unsuccessfullyPickedUpRefund(req, res);
});

app.get('/refund/:orderToken', (req, res) => {
    refund(req, res);
});



app.listen(port, () => console.log('Server ready'))