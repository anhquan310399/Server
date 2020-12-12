const mongoose = require("mongoose");

const topicSchema = require("./topic")

const forum = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of forum is required']
    },
    description: String,
    topics: [topicSchema],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = forum