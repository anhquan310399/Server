const mongoose = require("mongoose");

const discussion = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = discussion