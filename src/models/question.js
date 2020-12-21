const mongoose = require("mongoose");

const questionOption = new mongoose.Schema({
    answer: {
        type: String,
        required: [true, 'Vui lòng nhập nội dung đáp án']
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
})

const question = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Vui lòng nhập nội dung câu hỏi']
    },
    answers: {
        type: [questionOption],
        required: [true, 'Vui lòng nhập đáp án']
    },
    typeQuestion: {
        type: String,
        required: [true, 'Vui lòng chọn loại câu hỏi'],
        enum: ['choice', 'multiple']
    },
    explain: String
})


module.exports = question