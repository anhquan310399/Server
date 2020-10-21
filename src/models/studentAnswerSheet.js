const mongoose = require("mongoose");

const studentAnswer = require("./studentAnswer")
const studentAnswerSchema = studentAnswer.studentAnswerSchema

const studentAnswerSheet = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    answers: [studentAnswerSchema]
})


exports.studentAnswerSheetSchema = studentAnswerSheet