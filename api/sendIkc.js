const User = require('../models/users');
const IkcTransfer = require('../models/ikcTransfer')

const sendIkc = async (req, res) => {
    await User.findByIdAndUpdate(req.User._id, {
        $inc: -req.body.amount
    });

    await User.findOneAndUpdate({ contact: req.body.to }, {
        $inc: req.body.amount
    });

    const ikcTransfer = new IkcTransfer({
        to: req.body.to,
        amount: req.body.amount
    })
}

module.exports = sendIkc