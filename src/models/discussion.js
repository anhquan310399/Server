const mongoose = require("mongoose");

const discussion = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Content of discussion is required!']
    },
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = discussion