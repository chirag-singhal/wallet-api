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




module.exports = Offerer