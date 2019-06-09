const http = require('http')
const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');

const user = require('./users')
const auth = require('./login')



const app = express()
const url = 'mongodb://localhost:27017/ikc';

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const connect = mongoose.connect(url,{useNewUrlParser : true});

app.use(morgan('dev'))

connect.then((db) => {
    console.log("connected to database");
}, (err) => {console.log(err);})

const hostname = 'localhost'
const port = 3000

const server = http.createServer(app);

server.listen(port, hostname, () => console.log('Server ready'))

app.use('/auth', auth);

    