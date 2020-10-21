const mongoose = require("mongoose");

const discussion = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createId: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
        default: null
    }
})

exports.discussionSchema = discussion