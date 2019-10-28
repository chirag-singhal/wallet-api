const ShopingCategory = require('../models/shopingCategory');
const ShopingDeliveryAddress = require('../models/shopingDeliveryAddress');
const ShopingOrder = require('../models/shopingOrder');
const path = require('path');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const ShopVendor = require('../models/ShopVendor');
const User = require('../models/users');
const db = require('../firestore')
const admin = require('firebase-admin');


const checkoutShopingCart = async (req, res) => {
    const cartProducts = req.body.cartProducts;    
    let amount = 0;
    const outOfStock = [];

    for(const cartProduct of cartProducts) {
        amount += cartProduct.price * cartProduct.quantity;
        const shopingCategory = await ShopingCategory.findById(cartProduct.categoryId);
    
        const product = await shopingCategory.products.id(cartProduct.productId);
        if(cartProduct.quantity > product.stock) {
            outOfStock.push(cartProduct.productId)
        }
    }

    if(amount > req.user.amount) {
        return res.status(403).json({"message": "Not enough ikc balance!", "outOfStock": outOfStock});
    }

    if(outOfStock.length > 0){
        return res.status(403).json({"message": "Out of Stock Products!", "outOfStock": outOfStock});
    }


    const DeliveryAddress = await ShopingDeliveryAddress.findOne({userId: req.user._id});
    
    for(const cartProduct of cartProducts) {
        const shopingCategory = await ShopingCategory.findById(cartProduct.categoryId);
        const product = await shopingCategory.products.id(cartProduct.productId);
        const orderId = shortid.generate();

        const vendor = await ShopVendor.findById(product.ShopVendorId)
        const user = await User.findById(vendor.walletId);
        const shopingOrder = new ShopingOrder({
            orderId: orderId,
            userId: req.user._id,
            product: cartProduct,
            quantity: cartProduct.quantity,
            deliveryAddress: DeliveryAddress,
            amount: cartProduct.quantity * cartProduct.price
        });
        await db(user.contact, 
            {
                transactionId: shortid.generate(),
                amount: +cartProduct.quantity * cartProduct.price,
                transactionStatus: 'TXN_SUCCESS',
                name: user.name,
                contact: user.contact,
                paymentType: 'ikc',
                detail: "Products Sold",
                time: Date.now()
            },
            user.amount + (cartProduct.quantity * cartProduct.price)
        )
        user.transactions.push({
            transactionId: shortid.generate(),
            amount: +cartProduct.quantity * cartProduct.price,
            transactionStatus: 'TXN_SUCCESS',
            name: user.name,
            contact: user.contact,
            paymentType: 'ikc',
            detail: "Products Sold",
            time: Date.now()
        })
        user.amount += cartProduct.quantity * cartProduct.price;
        req.user.orders.push({
            orderId: orderId,
            userId: req.user._id,
            product: cartProduct,
            quantity: cartProduct.quantity,
            deliveryAddress: DeliveryAddress,
            amount: cartProduct.quantity * cartProduct.price
        })
        vendor.orders.push({
            orderId: orderId,
            userId: req.user._id,
            product: cartProduct,
            quantity: cartProduct.quantity,
            deliveryAddress: DeliveryAddress,
            amount: cartProduct.quantity * cartProduct.price
        })
        vendor.totalEarnings += cartProduct.quantity * cartProduct.price;
        await user.save();
        await vendor.save();
        await req.user.save();
        
        await shopingOrder.save().then(async () => {
            shopingOrder.deliveredUrl = path.join(req.headers.host, "/delivered/", jwt.sign({orderId: shopingOrder._id}, "This is my secret code for refund process. Its highly complicated"));
            await ShopingOrder.updateOne({ _id: shopingOrder._id }, { $currentDate: {
                    orderDate: true
                }
            });
            await shopingOrder.save();
        });

        await User.findByIdAndUpdate(req.user._id, {
            $inc: {
                amount: -(cartProduct.quantity * cartProduct.price)
            }
        });

        product.stock -= cartProduct.quantity;
        product.noOfStockSold += cartProduct.quantity;
        await shopingCategory.save();


    }
    await db(req.user.contact,
        {
            transactionId: shortid.generate(),
            amount: amount,
            name: user.name,
            contact: user.contact,
            transactionStatus: 'TXN_SUCCESS',
            paymentType: 'ikc',
            detail: "Paid for Order " + amount,
            time: Date.now()
        },
        user.amount - (cartProduct.quantity * cartProduct.price)
    )
    await User.findByIdAndUpdate(req.user._id, {
        $push: {
            transactions: {
                transactionId: shortid.generate(),
                amount: amount,
                name: user.name,
                contact: user.contact,
                transactionStatus: 'TXN_SUCCESS',
                paymentType: 'ikc',
                detail: "Paid for Order " + amount,
                time: Date.now()
            }
        }
    });

    res.status(200).json({"message": "Order successfully placed!"});
}

module.exports = checkoutShopingCart;