const mongoose = require("mongoose");

const discussionSchema = require("./discussion");

const topic = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    discussions: [discussionSchema],
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = topic