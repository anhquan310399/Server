const mongoose = require("mongoose");

const infoUser = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    urlAvatar: {
        type: String,
        required: true
    }
}, { _id: false })

module.exports = infoUser