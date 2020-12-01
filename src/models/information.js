const mongoose = require("mongoose");

const information = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Chưa nhập tiêu đề thông báo!']
    },
    content: {
        type: String,
        required: [true, 'Chưa nhập nội dung thông báo!']
    }
}, { timestamps: true });

module.exports = information