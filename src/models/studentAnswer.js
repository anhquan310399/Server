const mongoose = require("mongoose");

const studentAnswer = new mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
    answerId: {
        type: String,
        default: ''
    },
})


module.exports = studentAnswer