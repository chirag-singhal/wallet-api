const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');

const Users = require('../model/users')

const auth = express.Router();

auth.use(bodyParser.json());

auth.route('/login')
.get((req, res, next) => {
    if(req.body.email && req.body.password){
        Users.findOne({email: req.body.email}).exec()
        .then((user) => {
            if(user == null){
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end("User not exits");
            }
            else{
                bcrypt.compare(req.body.password, user.password)
                .then((result) => {
                    if(result == true){
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(user);
                    }
                    else{
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("Incorrect Password");
                    }
                })
                .catch((err) => next(err));
            }
        })
        .catch((err) => {
            console,log(err);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(err);})
    }
    else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end("Missing Fields");
    }
})

auth.route('/signup')
.post((req, res, next) => {
    console.log(req.body);
    if (req.body.email && req.body.username &&
        req.body.password && req.body.country && req.body.contact) {

        Users.findOne({email: req.body.email}).exec()
        .then((user) => {
                if(user != null){
                    console.log(user);
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.end("User already exits");
                }
                else{
                    Users.findOne({username: req.body.username}).exec()
                    .then((user) => {
                        if(user != null){
                            res.statusCode = 403;
                            res.setHeader('Content-Type', 'application/json');
                            res.end("User already exits");
                        }
                        else{
                            Users.create(req.body)
                            .then((user) =>{
                                console.log(user);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.end("User created");
                            })
                            .catch((err) => next(err));
                        }
                    })
                    .catch((err) => next(err));
                }
        })
        .catch((err) => {
            console,log(err);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(err);
        })
      }
      else{
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end("Missing Fields");
        }
    })

    module.exports = auth;

