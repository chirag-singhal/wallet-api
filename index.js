const http = require('http')
const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');


const user = require('./users')
const auth = require('./login')

const getCategories = require('./api/getCategories');

const addToCart = require('./api/addToCart');


const app = express()
const url = 'mongodb://localhost:27017/ikc';


const hostname = 'localhost'
const port = 3000


app.use(express.json());
app.use(morgan('dev'))
app.use('/auth', auth);



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



// ----------------------------------------------------Cart request---------------------------------------------------------------------------
app.post('/cart', (req, res) => {
    addToCart(req, res);
});



app.listen(port, hostname, () => console.log('Server ready'))