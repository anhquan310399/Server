const mongoose = require("mongoose");

const studentAnswer = require("./studentAnswer")
const studentAnswerSchema = studentAnswer.studentAnswerSchema

const studentAnswerSheet = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    answers: {
        type: [studentAnswerSchema],
        required: true
    },
    grade: Number
})


module.exports = studentAnswerSheet