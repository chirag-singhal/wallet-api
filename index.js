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
const changePassword = require('./api/changePassword')
const forgotPassword = require('./api/forgotPassword')
const Offerers = require('./models/offerer')


const getCategories = require('./api/getCategories');
const getTransactions = require('./api/getTransactions')
const getUserDetails = require('./api/getUserDetail');
const addToCart = require('./api/addToCart');
const removeFromCart = require('./api/removeFromCart');
const getCartProducts = require('./api/getCartProducts');
const getAuctionProducts = require('./api/getAuctionProducts');
const placeBid = require('./api/placeBid');
const getAffiliateProduct = require('./api/getAffiliateProduct');
const incrementCartProductQty = require('./api/incrementCartProductQty');
const decrementCartProductQty = require('./api/decrementCartProductQty');
const addShopingDeliveryAddress = require('./api/addShopingDeliveryAddress');
const checkoutShopingCart = require('./api/checkoutShopingCart');
const getShopingDeliveryAddress = require('./api/getShopingDeliveryAddresses');
const getShopingOrder = require('./api/getshopingOrders');
const cancelBeforeDelivery = require('./api/cancelBeforeDelivery');
const refundShopingOrder = require('./api/refundShopingOrder');
const replaceShopingOrder = require('./api/replaceShopingOrder');
const deliveredUrl = require('./api/deliveredUrl');
const successfullyPickedUpRefund = require('./api/successfullyPickedUpRefund');
const unsuccessfullyPickedUpRefund = require('./api/unsuccessfullyPickedUpRefund');
const refund = require('./api/refund');
const successfullyPickedUpReplace = require('./api/successfullyPickedUpReplace');
const unsuccessfullyPickedUpReplace = require('./api/unsuccessfullyPickedUpReplace');
const getShopAndEarnCategories = require('./api/getShopAndEarnCategories');
const buyWithIkc = require('./api/buyWithIkc');
const getShopAndEarnOrder = require('./api/getShopAndEarnOrders');
const sendIkc = require('./api/sendIkc');
const recharge = require('./api/recharge')
const rechargePending = require('./api/rechargePending')
const buyEvent = require('./api/buyEvents');
const getEvents = require('./api/getEvents');
const getEventsForOwner = require('./api/getEventsForOwner');
const addEventTemp = require('./api/addTempEvent');
const verifyTicket = require('./api/verifyTicket');
const jwtEventVerify = require('./jwtVerifyEvents');
const eventLogin = require('./api/loginEvent');
const addEvent = require('./api/addEvent');
const getTickets = require('./api/getTickets');
const createWallet = require('./api/createWallet');
const getBalance = require('./api/getBalance');
const dthRecharge = require('./api/dth');
const send = require('./api/send');
const deliveryLogin = require('./api/deliveryLogin');
const ShopVendorLogin = require('./api/ShopVendorLogin');
const auctionLogin = require('./api/auctionLogin');
const addAuction = require('./api/addAuction');
const jwtAuction = require('./jwtAuction');
const jwtDelivery = require('./jwtDelivery');
const jwtShopVendor = require('./jwtShopVendor');
const deliveryProducts = require('./api/getDeliveryProducts');
const getOrdersVendor = require('./api/getOrdersVendor');
const getOrders = require('./api/getOrders');
const getAuctionOrders = require('./api/getAuctionVendor')
const assign = require('./api/assign');
const outForDelivery = require('./api/outForDelivery');
const delivered = require('./api/delivered');
const cantDeliver = require('./api/cantDeliver')
const sendOtp = require('./api/sendOtp');
const check = require('./api/check');
const getBids = require('./api/getBids');
const redeem = require('./api/redeemAuction');
const result = require('./api/calculateAuctionResults');
const addProducts = require('./api/addProduct');
const shopVendorFirstLogin = require('./api/shopVendorFirstLoginn');
const bcrypt = require('bcrypt');

const app = express()
const url = 'mongodb://localhost:27017/ikc';



// const hostname = 'localhost'
const port = 3000



app.use(express.json());
app.use(morgan('dev'))


//---------------------------------------------------I Kick--------------------------------------------------------------------

app.use('/getBalance', getBalance)
app.use('/createWallet', createWallet)


bcrypt.hash("a", 10, function (err, hash) {
    console.log(hash)
})

// ------------------------------------------------Login & Sign Up----------------------------------------------------------------
app.use('/auth', auth);
app.use('/verifyUser', verifyUser)
app.use('/changePassword', changePassword)
app.use('/forgotPassword', forgotPassword)
app.use('/getTickets', jwtVerify, getTickets)


// ----------------------------------------------------Connect to Database--------------------------------------------------------------------
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const connect = mongoose.connect(url,{useNewUrlParser : true});

connect.then((db) => {
    console.log("connected to database");
}, (err) => {
    console.log(err);
})


//--------------------------------------------------Events------------------------------------------------------------------------

app.use('/buyEvent', jwtVerify, buyEvent);
app.use('/getEvents', jwtVerify, getEvents);
app.use('/getEventsForOwner', jwtEventVerify, getEventsForOwner);
app.use('/addTempEvent', jwtEventVerify, addEventTemp);
app.use('/addEvent', addEvent);
app.use('/eventLogin', eventLogin);
app.use('/verifyTicket', jwtEventVerify, verifyTicket)

// ------------------------------------------------Update Password----------------------------------------------------------------
app.use('/updatePassword', jwtVerify, updatePassword);

//----------------------------------------------------Recharge--------------------------------------------------------------------

app.use('/recharge', jwtVerify, recharge);
app.use('/dthRecharge', jwtVerify, dthRecharge);

app.use('/rechargePending', rechargePending);

app.post('/resend', (req, res) => {
    sendOtp(req.body.contact, req.body.countrycode, function(result) {
        if(result){
            res.json({"message": "OTP send"});
        }
        else {
            res.statusCode = 403;
            res.json({"message": "OTP not send"});
        }
    })
})

// ------------------------------------------------Update Profile----------------------------------------------------------------
app.use('/updateProfile', jwtVerify, updateProfile);

app.use('/getTransactions', jwtVerify, getTransactions)

app.use('/getUserDetails', jwtVerify, getUserDetails);

// ------------------------------------------------Shopping Categories Request----------------------------------------------------------------
app.get('/categories', (req, res) => {
    getCategories(req, res);
});

app.use('/check', jwtVerify, check);

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
app.post('/shoppingDeliveryAddress', jwtVerify, (req, res) => {
    addShopingDeliveryAddress(req, res); 
});

app.get('/shoppingDeliveryAddress', jwtVerify, (req, res) => {
    getShopingDeliveryAddress(req, res);
});

app.post('/shoppingOrder', jwtVerify, (req, res) => {
    checkoutShopingCart(req, res);
});

app.get('/shoppipngOrder', jwtVerify, (req, res) => {
    getShopingOrder(req, res);
});



// --------------------------------------common shoping and shop & earn requests-------------------------------------------------------
app.patch('/cancelBeforeDelivery', jwtVerify, (req, res) => {
    cancelBeforeDelivery(req, res);
});

app.patch('/refundShopingOrder', jwtVerify, (req, res) => {
    refundShopingOrder(req, res);
});

app.patch('/replaceShopingOrder', jwtVerify, (req, res) => {
    replaceShopingOrder(req, res);
});


//--------------------------------------Vendor and Delivery--------------------------------------------------------------------------------------

app.use('/deliveryLogin', deliveryLogin);

app.use('/shopVendorLogin', ShopVendorLogin);

app.use('/auctionLogin', auctionLogin);

app.use('/addAuction', jwtAuction, addAuction);

app.use('/getOrdersVendor', jwtShopVendor, getOrdersVendor);

app.use('/getOrders', jwtVerify, getOrders);

app.use('/getDeliveryProducts', jwtDelivery, deliveryProducts)

app.use('/getAuctions', jwtAuction, getAuctionOrders);

app.use('/outForDelivery', jwtDelivery, outForDelivery);

app.use('/deliveredOrder', jwtDelivery, delivered);

app.use('/cantDeliver', jwtDelivery, cantDeliver);

app.use('/assign', jwtShopVendor, assign);

app.use('/assignAuction', jwtAuction, assign);

app.use('/getBids', jwtVerify, getBids);

app.use('/auctionResults', jwtAuction, result);

app.use('/redeem', jwtVerify, redeem);

app.use('/addProduct', jwtShopVendor, addProducts);

app.use('/shopVendorFirstLogin', shopVendorFirstLogin);

app.get('/redirect', (req, res) => {
    res.statusCode = 302;
    res.setHeader('Location', 'https://play.google.com/store/apps/details?id=ikcdeal.com')
    res.end();
})

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

app.get("/payWithPaytm", jwtVerify, (req, res) => {
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
app.post("/addTOWallet", jwtVerify, (req, res) => {
    initAdd(req).then(
        success => {
            console.log(success)
            res.json({
                resultData: success,
                paytmFinalUrl: config.PAYTM_FINAL_URL
            });
        },
        error => {
            res.send(error);
        }
    );
});

app.post("/addToWalletResponse", jwtVerify, (req, res) => {
    responseAdd(req).then(
        success => {
            res.json({"message": success});
        },
        error => {
            res.json({"message": error});
        }
    );
});

app.use('/sendIkc', jwtVerify, sendIkc);
app.use('/send', jwtVerify, send);


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
app.get('/delivered/:orderToken', (req, res) => {
    deliveredUrl(req, res);
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