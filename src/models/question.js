const mongoose = require("mongoose");

const questionOption = new mongoose.Schema({
    answer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
})

const question = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answers: {
        type: [questionOption],
        required: true
    },
    typeQuestion: {
        type: String,
        required: true
    },
    explain: String
})


module.exports = question