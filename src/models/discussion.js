const mongoose = require("mongoose");

const infoUser = require('./infoUser');

const discussion = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    create: {
        type: infoUser,
        required: true
    }
}, { timestamps: true })

module.exports = discussion