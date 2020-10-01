const mongoose = require("mongoose");

const question = require("./question")
const questionSchema = question.questionSchema

const studentAnswerSheet = require("./studentAnswerSheet")
const studentAnswerSheetSchema = studentAnswerSheet.studentAnswerSheetSchema

const exam = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    content: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    expireTime: {
        type: Date,
        required: true
    },
    attemptCount: {
        type: Number,
        required: true
    },
    questions: [questionSchema],
    studentExams: [studentAnswerSheetSchema]
});



exports.examSchema = exam

exports.examModel = mongoose.model("exam", exam)