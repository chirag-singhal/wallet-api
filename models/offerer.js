const mongoose = require('mongoose');


const OffererSchema = new mongoose.Schema({
    offererName: {
        type: String
    },
    offererImage: {
        type: String
    }
});

var Offerer = mongoose.model('offerers', OffererSchema)


// Offerers.create({
//     offererName: "Test Actor",
//     offererImage: "../images/RBF-SNC-25D-600x600.gif"
// }).then((offer) => {
//     console.log(offer)
// })
// .catch((err) => console.log(err))

module.exports = Offerer