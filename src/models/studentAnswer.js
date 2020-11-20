const mongoose = require("mongoose");

const studentAnswer = new mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
    answerId: {
        type: String,
        required: true
    },
})


module.exports = studentAnswer