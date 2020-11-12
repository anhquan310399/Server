const mongoose = require("mongoose");

const topicSchema = require("./topic")

const forum = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    topics: [topicSchema],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = forum