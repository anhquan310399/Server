const mongoose = require("mongoose");


const file = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        require: true
    },
    path: {
        type: String,
        require: true
    },
    uploadDay: {
        type: Date,
        default: Date.now()
    }
});


module.exports = file