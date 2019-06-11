const http = require('http')
const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');

const user = require('./users')
const auth = require('./login')


const Category = require('./model/category');
const getCategories = require('./api/getCategories');


const app = express()
const url = 'mongodb://localhost:27017/ikc';


const hostname = 'localhost'
const port = 3000


mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const connect = mongoose.connect(url,{useNewUrlParser : true});

app.use(morgan('dev'))

app.use(express.json());

connect.then((db) => {
    console.log("connected to database");
}, (err) => {console.log(err);})


// const server = http.createServer(app);


app.get('/getCategories', (req, res) => {
    getCategories(req, res);
});



app.use('/auth', auth);


app.listen(port, hostname, () => console.log('Server ready'))