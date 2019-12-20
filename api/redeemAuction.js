const express = require('express')
const bodyParser = require('body-parser')
const shortid = require('shortid');

const User = require('../models/users');
const Auction = require('../models/auctionProducts');
const AuctionVendor = require('../models/auctionVendor')
const ShopingOrder = require('../models/shopingOrder');
const ShoppingDeliveryAddress = require('../models/shopingDeliveryAddress')
const redeem = express.Router();
redeem.use(bodyParser.json())
const db = require('../firestore')
const admin = require('firebase-admin');

redeem.route('/')
    .post(async (req, res, next) => {
        let bidAmount;
        const deliveryAddress = await ShoppingDeliveryAddress.findOne({ userId: req.user._id });
        for (bid of req.user.bids)
            if (req.body.auctionId == bid.auctionId && bid.winner == 'won')
                bidAmount = bid.bidAmount;
        if (req.user.amount > bidAmount) {
            res.statusCode = 403
            res.json({ "message": "Insufficient Balance" })
        }
        else {
            const orderId = shortid.generate();
            req.user.amount -= bidAmount;
            await db(req.user.contact, {
                    transactionId: shortid.generate(),
                    amount: -bidAmount,
                    transactionStatus: 'TXN_SUCCESS',
                    name: "Auction",
                    contact: req.user.contact,
                    paymentType: 'ikc',
                    detail: "Auction Won",
                    time: Date.now()
                },
                req.user.amount - bidAmount
            )
            req.user.transactions.push({
                transactionId: shortid.generate(),
                amount: -bidAmount,
                transactionStatus: 'TXN_SUCCESS',
                name: "Auction",
                contact: req.user.contact,
                paymentType: 'ikc',
                detail: "Auction Won",
                time: Date.now()
            })
            const product = await Auction.findById(req.body.auctionId);
            const auctionVendor = await AuctionVendor.findById(product.auctionCreator);
            auctionVendor.totalEarnings += bidAmount;
            auctionVendor.orders.push({
                orderId: orderId,
                userId: req.user._id,
                auctionId: req.body.auctionId,
                product: product,
                quantity: 1,
                deliveryAddress: deliveryAddress,
                amount: bidAmount
            })
            const user = await User.findById(auctionVendor.walletId)
            user.amount += bidAmount;
            req.user.auctionOrder.push({
                orderId: orderId,
                auctionId: req.body.auctionId,
                product: product,
                quantity: 1,
                deliveryAddress: deliveryAddress,
                amount: bidAmount
            });
            await db(user.contact, {
                    transactionId: shortid.generate(),
                    amount: +bidAmount,
                    transactionStatus: 'TXN_SUCCESS',
                    name: "Auction",
                    contact: user.contact,
                    paymentType: 'ikc',
                    detail: "Auction Sold",
                    time: Date.now()
                },
                user.amount + bidAmount
            )
            user.transactions.push({
                transactionId: shortid.generate(),
                amount: +bidAmount,
                transactionStatus: 'TXN_SUCCESS',
                name: "Auction",
                contact: user.contact,
                paymentType: 'ikc',
                detail: "Auction Sold",
                time: Date.now()
            })
            await shopingOrder.save().then(async () => {
                shopingOrder.deliveredUrl = path.join(req.headers.host, "/delivered/", jwt.sign({ orderId: shopingOrder._id }, "This is my secret code for refund process. Its highly complicated"));
                await ShopingOrder.updateOne({ _id: shopingOrder._id }, {
                    $currentDate: {
                        orderDate: true
                    }
                });
                await shopingOrder.save();
            });
            await user.save();
            await auctionVendor.save();
            await req.user.save();
        }
    })

    module.exports = redeem;