const mongoose = require("mongoose");

const discussionSchema = require("./discussion");

const topic = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tiêu đề Topic"]
    },
    content: {
        type: String,
        required: [true, "Vui lòng nhập nội dung Topic"]
    },
    discussions: [discussionSchema],
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = topic