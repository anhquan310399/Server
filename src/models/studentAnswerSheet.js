const mongoose = require("mongoose");

const studentAnswerSchema = require("./studentAnswer")

const studentAnswerSheet = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    answers: {
        type: [studentAnswerSchema],
        required: true
    },
    grade: Number,
    isSubmitted: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: Date,
        default: Date.now()
    }
});

module.exports = studentAnswerSheet