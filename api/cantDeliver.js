const express = require('express');
const bodyParser = require('body-parser')
const cantDeliver = express.Router();
const AuctionVendor = require('../models/auctionVendor')
cantDeliver.use(bodyParser.json())
const shortid = require('shortid')
const ShopVendor = require('../models/ShopVendor')
const User = require('../models/users')
const Delivery = require('../models/delivery')
cantDeliver.route('/')
    .post(async (req, res, next) => {
        const user = await User.findOne({ 'orders.orderId': req.body.orderId })
        if (user != null) {
            let offererId;
            const delivery = await Delivery.findOne({ 'orders.orderId': req.body.orderId })
            for (let i = 0; i < delivery.orders.length; i++) {
                if (delivery.orders[i].orderId == req.body.orderId) {
                    delivery.orders[i].status = 'Out for Delivery';
                    break;
                }
            }
            for (let i = 0; i < user.orders.length; i++) {
                if (user.orders[i].orderId == req.body.orderId) {
                    user.orders[i].status = "Unable to Deliver";
                    user.amount += user.orders[i].amount
                    user.transactions.push({
                        transactionId: shortid.generate(),
                        amount: user.orders[i].amount,
                        transactionStatus: 'TXN_SUCCESS',
                        name: "Refund",
                        contact: user.contact,
                        paymentType: 'ikc',
                        detail: "Refund",
                        time: Date.now()
                    })
                    offererId = user.orders[i].product.offererId;
                    break;
                }
            }
            const shopVendor = await ShopVendor.findById(offererId)
            for (let i = 0; i < shopVendor.orders.length; i++) {
                if (shopVendor.orders[i].orderId == req.body.orderId) {
                    shopVendor.orders[i].status = "Unable to Deliver";
                    shopVendor.totalEarnings -= shopVendor.orders[i].amount;
                    const wallet = await User.findById(shopVendor.walletId)
                    wallet.amount -= shopVendor.orders[i].amount;
                    wallet.transactions.push({
                        transactionId: shortid.generate(),
                        amount: -shopVendor.orders[i].amount,
                        transactionStatus: 'TXN_SUCCESS',
                        name: "Refund",
                        contact: wallet.contact,
                        paymentType: 'ikc',
                        detail: "Refund",
                        time: Date.now()
                    })
                    await wallet.save();
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
            for (let i = 0; i < delivery.orders.length; i++) {
                if (delivery.auctionOrders[i].orderId == req.body.orderId) {
                    delivery.auctionOrders[i].status = 'Out for Delivery';
                    break;
                }
            }
            for (let i = 0; i < user.auctionOrders.length; i++) {
                if (user.auctionOrders[i].orderId == req.body.orderId) {
                    user.auctionOrders[i].status = "Unable to Deliver";
                    user.amount += user.orders[i].amount
                    user.transactions.push({
                        transactionId: shortid.generate(),
                        amount: user.orders[i].amount,
                        transactionStatus: 'TXN_SUCCESS',
                        name: "Refund",
                        contact: user.contact,
                        paymentType: 'ikc',
                        detail: "Refund",
                        time: Date.now()
                    })
                    break;
                }
            }
            for (let i = 0; i < auctionVendor.orders.length; i++) {
                if (auctionVendor.orders[i].orderId == req.body.orderId) {
                    auctionVendor.orders[i].status = "Unable to Deliver"
                    auctionVendor.totalEarnings -= shopVendor.orders[i].amount;
                    const wallet = await User.findById(auctionVendor.walletId)
                    wallet.amount -= auctionVendor.orders[i].amount;
                    wallet.transactions.push({
                        transactionId: shortid.generate(),
                        amount: -auctionVendor.orders[i].amount,
                        transactionStatus: 'TXN_SUCCESS',
                        name: "Refund",
                        contact: wallet.contact,
                        paymentType: 'ikc',
                        detail: "Refund",
                        time: Date.now()
                    })
                    await wallet.save();
                    break;
                }
            }
            await auctionVendor.save();
            await delivery.save();
            await user.save();
        }
    })

module.exports = cantDeliver