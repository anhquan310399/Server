const mongoose = require("mongoose");

const information = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

exports.informationSchema = information