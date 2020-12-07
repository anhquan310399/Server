const mongoose = require("mongoose");

const discussion = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Vui lòng nhập nội dung thảo luận']
    },
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = discussion