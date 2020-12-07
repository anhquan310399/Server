const mongoose = require("mongoose");

const topicSchema = require("./topic")

const forum = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tiêu đề thông báo']
    },
    description: String,
    topics: [topicSchema],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = forum