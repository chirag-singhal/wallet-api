const http = require('http')
const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');

const auth = require('./api/login')
const updatePassword = require('./api/updatePassword')
const updateProfile = require('./api/updateProfile')
const jwtVerify = require('./jwtverify')
const verifyUser = require('./api/verifyUser')



const getCategories = require('./api/getCategories');
const addToCart = require('./api/addToCart');
const removeFromCart = require('./api/removeFromCart');
const getCartProducts = require('./api/getCartProducts');


const app = express()
const url = 'mongodb://localhost:27017/ikc';


const hostname = 'localhost'
const port = 3000


app.use(express.json());
app.use(morgan('dev'))

app.all('*', jwtVerify)

// ------------------------------------------------Login & Sign Up----------------------------------------------------------------

app.use('/auth', auth);
app.use('/verifyUser', verifyUser)

// ----------------------------------------------------Connect to Database--------------------------------------------------------------------
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const connect = mongoose.connect(url,{useNewUrlParser : true});

connect.then((db) => {
    console.log("connected to database");
}, (err) => {console.log(err);})



// ------------------------------------------------Shopping categories request----------------------------------------------------------------
app.get('/categories', (req, res) => {
    getCategories(req, res);
});

// ------------------------------------------------Update Password----------------------------------------------------------------
app.use('/updatePassword', updatePassword);


// ------------------------------------------------Update Profile----------------------------------------------------------------
app.use('/updateProfile', updateProfile);



// ----------------------------------------------------Cart request---------------------------------------------------------------------------
app.post('/cart', (req, res) => {
    addToCart(req, res);
});

app.delete('/cart', (req, res) => {
    removeFromCart(req, res);
});

app.get('/cart', (req, res) => {
    getCartProducts(req, res);
});



app.listen(port, hostname, () => console.log('Server ready'))