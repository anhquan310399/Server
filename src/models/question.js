const mongoose = require("mongoose");

const questionOption = new mongoose.Schema({
    answer: {
        type: String,
        required: true
    },
})

const question = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answers: [questionOption],
    correctAnswer: {
        type: Date,
        required: true
    },
})


exports.questionSchema = question

exports.questionModel = mongoose.model("question", question)