const express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/users')
const delivered = express.Router();
const AuctionVendor = require('../models/auctionVendor')

delivered.use(bodyParser.json())

const Delivery = require('../models/delivery')
const ShopVendor = require('../models/ShopVendor')

delivered.route('/')
    .post(async (req, res, next) => {
        const user = await User.findOne({ 'orders.orderId': req.body.orderId })
        if (user != null) {
            let offererId;
            const delivery = await Delivery.findOne({ 'orders.orderId': req.body.orderId })
            for(let i = 0; i < delivery.orders.length; i++){
                if(delivery.orders[i].orderId == req.body.orderId){
                    delivery.orders[i].status = 'Delivered';
                    break;
                }
            }
            for (let i = 0; i < user.orders.length; i++) {
                if (user.orders[i].orderId == req.body.orderId) {
                    user.orders[i].status = "Delivered";
                    offererId = user.orders[i].product.offererId;
                    break;
                }
            }
            const shopVendor = await ShopVendor.findById(offererId)
            for (let i = 0; i < shopVendor.orders.length; i++) {
                if (shopVendor.orders[i].orderId == req.body.orderId) {
                    shopVendor.orders[i].status = "Delivered";
                    break;
                }
            }
            await user.save();
            await delivery.save();
            await shopVendor.save();
        }
        else {
            const user = await User.findOne({ 'auctionOrders.orderId': req.body.orderId });
            const auctionVendor = await AuctionVendor.findOne({ 'orders.orderId': req.body.orderId })
            const delivery = await Delivery.findOne({ 'auctionOrders.orderId': req.body.orderId })
            for(let i = 0; i < delivery.orders.length; i++){
                if(delivery.auctionOrders[i].orderId == req.body.orderId){
                    delivery.auctionOrders[i].status = 'Delivered';
                    break;
                }
            }
            for (let i = 0; i < user.auctionOrders.length; i++) {
                if (user.auctionOrders[i].orderId == req.body.orderId) {
                    user.auctionOrders[i].status = "Delivered";
                    break;
                }
            }
            for (let i = 0; i < auctionVendor.orders.length; i++) {
                if (auctionVendor.orders[i].orderId == req.body.orderId) {
                    auctionVendor.orders[i].status = "Delivered"
                    break;
                }
            }
            await auctionVendor.save();
            await user.save();
            await delivery.save();
        }
    })

module.exports = delivered