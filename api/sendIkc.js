const User = require('../models/users');
const IkcTransfer = require('../models/ikcTransfer')

const sendIkc = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $inc: -req.body.amount
    });

    await User.findOneAndUpdate({ contact: req.body.to }, {
        $inc: req.body.amount
    });

    const ikcTransfer = new IkcTransfer({
        to: req.body.to,
        amount: req.body.amount
    });

    await User.findByIdAndUpdate(req.user._id, {
        $push: {
            transactions: {
                transactionId: shortid.generate(),
                amount: -req.body.amount,
                transactionStatus: 'TXN_SUCCESS',
                paymentType: 'ikc',
                detail: "Sent to " + req.body.to,
                time: Date.now()
            }
        }
    });

    res.send("ikc successfully transferred!")
}

module.exports = sendIkc