const mongoose = require("mongoose");

const discussionSchema = require("./discussion");

const infoUser = require('./infoUser');

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
    create: {
        type: infoUser,
        required: true
    }
}, { timestamps: true });


module.exports = topic