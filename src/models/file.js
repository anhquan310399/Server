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
    link: {
        type: String,
        require: true
    },
    uploadDay: {
        type: Date,
        required: true
    }
});


module.exports = file