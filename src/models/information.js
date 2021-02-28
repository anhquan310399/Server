var mongoose = require("mongoose");

var information = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of information is required!']
    },
    content: {
        type: String,
        required: [true, 'Content of information is required!']
    }
}, { timestamps: true });

module.exports = information