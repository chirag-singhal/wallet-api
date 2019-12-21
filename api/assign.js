const express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/users')
const assign = express.Router();
const AuctionVendor = require('../models/auctionVendor')
assign.use(bodyParser.json())
const ShopVendor = require('../models/ShopVendor')
const Delivery = require('../models/delivery')

assign.route('/')
.post(async (req, res, next) => {
    const user = await User.findOne({'auctionOrders.orderId': req.body.orderId});
    const delivery = await Delivery.findOne({'qrCode': req.body.qrCode});
    console.log(user, "USER HAI YE")
    if(user == null){
        let offererId;
        
        for(let i = 0; i < req.user.orders.length; i++){
            if(req.user.orders[i].orderId == req.body.orderId){
                req.user.orders[i].status = "Shipped";
                offererId = user.orders[i].userId;
                console.log(offererId)
                break;
            }
        }
        const shopVendor = req.user;
        const user = await User.findById(offererId);
        console.log(user, "USER HAI YE")
        for(let i = 0; i < user.orders.length; i++){
            if(user.orders[i].orderId == req.body.orderId){
                user.orders[i].status = "Shipped";
                offererId = user.orders[i].userId;
                console.log(offererId)
                break;
            }
        }
        for(let i = 0; i < shopVendor.orders.length; i++){
            if(shopVendor.orders[i].orderId == req.body.orderId){
                shopVendor.orders[i].status = "Shipped";
                delivery.orders.push({
                    orderId: shopVendor.orders[i].orderId,
                    userId: shopVendor.orders[i].userId,
                    product: shopVendor.orders[i].product,
                    quantity: shopVendor.orders[i].quantity,
                    deliveryAddress: shopVendor.orders[i].deliveryAddress,
                    amount: shopVendor.orders[i].amount,
                    status: 'Shipped'
                })
                break;
            }
        }
        await req.user.save();
        await user.save();
        await shopVendor.save();
    }
    else {
        const user = await User.findOne({'auctionOrders.orderId': req.body.orderId});
        const auctionVendor = await AuctionVendor.findOne({'orders.orderId': req.body.orderId})
        console.log(user, auctionVendor)
        for(let i = 0; i < user.auctionOrders.length; i++){
            if(user.auctionOrders[i].orderId == req.body.orderId){
                user.auctionOrders[i].status = "Shipped";
                break;
            }
        }
        for(let i = 0; i < auctionVendor.orders.length; i++){
            if(auctionVendor.orders[i].orderId == req.body.orderId){
                auctionVendor.orders[i].status = "Shipped"
                delivery.auctionOrders.push({
                    orderId: auctionVendor.orders[i].orderId,
                    userId: auctionVendor.orders[i].userId,
                    product: auctionVendor.orders[i].product,
                    quantity: auctionVendor.orders[i].quantity,
                    deliveryAddress: auctionVendor.orders[i].deliveryAddress,
                    amount: auctionVendor.orders[i].amount,
                    status: 'Shipped'
                })
                break;
            }
        }
        await delivery.save();
        await auctionVendor.save();
        await user.save();
    }
    res.statusCode = 200;
    res.json({"message": "Order Shipped"})
})

module.exports = assign