const http = require('http')
const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');
const bodyParser = require("body-parser");
const config = require('./paytm-integration/paytm/config');
const cors = require("cors");
const ejs = require("ejs");



const auth = require('./api/login')
const updatePassword = require('./api/updatePassword')
const updateProfile = require('./api/updateProfile')
const jwtVerify = require('./jwtverify')
const verifyUser = require('./api/verifyUser')
const verifyOtp = require('./api/verifyOtp')
const changePassword = require('./api/changePassword')
const forgotPassword = require('./api/forgotPassword')



const getCategories = require('./api/getCategories');
const getUserDetails = require('./api/getUserDetail');
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
const refund = require('./api/refund');
const successfullyPickedUpReplace = require('./api/successfullyPickedUpReplace');
const unsuccessfullyPickedUpReplace = require('./api/unsuccessfullyPickedUpReplace');
const getShopAndEarnCategories = require('./api/getShopAndEarnCategories');
const buyWithIkc = require('./api/buyWithIkc');
const getShopAndEarnOrder = require('./api/getShopAndEarnOrders');



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
}, (err) => {
    console.log(err);
})



// ------------------------------------------------Update Password----------------------------------------------------------------
app.use('/updatePassword', jwtVerify, updatePassword);



// ------------------------------------------------Update Profile----------------------------------------------------------------
app.use('/updateProfile', jwtVerify, updateProfile);


app.use('/getUserDetails', jwtVerify, getUserDetails);

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



// --------------------------------------common shoping and shop & earn requests-----------------------------
app.patch('/cancelBeforeDilivery', jwtVerify, (req, res) => {
    cancelBeforeDilivery(req, res);
});

app.patch('/refundShopingOrder', jwtVerify, (req, res) => {
    refundShopingOrder(req, res);
});

app.patch('/replaceShopingOrder', jwtVerify, (req, res) => {
    replaceShopingOrder(req, res);
});



// ------------------------------------------------------Shop and Earn----------------------------------------------------------------------------
app.get('/shopAndEarnCategory', (req, res) => {
    getShopAndEarnCategories(req, res);
});

app.post('/buyWithIkc', jwtVerify, (req, res) => {
    buyWithIkc(req, res);
});

app.get('/shopAndEarnOrder', jwtVerify, (req, res) => {
    getShopAndEarnOrder(req, res);
});

const {initPayment, responsePayment} = require("./paytm-integration/paytm/services/buy");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/paytm-integration/views"));
app.set("view engine", "ejs");

app.get("/payWithPaytm", (req, res) => {
    initPayment(req).then(
        success => {
            res.render("paytmRedirect.ejs", {
                resultData: success,
                paytmFinalUrl: config.PAYTM_FINAL_URL
            });
        },
        error => {
            res.send(error);
        }
    );
});

app.post("/payWithPaytmResponse", (req, res) => {
    responsePayment(req).then(
        success => {
            res.send(success);
        },
        error => {
            res.send(error);
        }
    );
});



// -----------------------------------------------------Wallet requests----------------------------------------------------------------------
const {initAdd, responseAdd} = require("./paytm-integration/paytm/services/add");
app.get("/addTOWallet", (req, res) => {
    initAdd(req).then(
        success => {
            res.render("paytmRedirect.ejs", {
                resultData: success,
                paytmFinalUrl: config.PAYTM_FINAL_URL
            });
        },
        error => {
            res.send(error);
        }
    );
});

app.post("/addToWalletResponse", (req, res) => {
    responseAdd(req).then(
        success => {
            res.send(success);
        },
        error => {
            res.send(error);
        }
    );
});



// ----------------------------------------------------Auction Request-------------------------------------------------------------------------
app.get('/auction', (req, res) => {
    getAuctionProducts(req, res);
});

app.post('/auction', jwtVerify, (req, res) => {
    placeBid(req, res);
});



// --------------------------------------------Affiliate Product-------------------------------------------------------------------
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



// ------------------------------------------admin managed requests---------------------------------------
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

app.get('/successfullyPickedUpReplace/:orderToken', (req, res) => {
    successfullyPickedUpReplace(req, res);
});

app.get('/unsuccessfullyPickedUpReplace/:orderToken', (req, res) => {
    unsuccessfullyPickedUpReplace(req, res);
});



app.listen(port, () => console.log('Server ready'))