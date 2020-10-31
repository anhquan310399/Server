const mongoose = require("mongoose");

const studentAnswerSheet = require("./studentAnswerSheet")
const studentAnswerSheetSchema = studentAnswerSheet.studentAnswerSheetSchema

const setting = new mongoose.Schema({
    questionCount: {
        type: Number,
        require: true
    },
    timeToDo: {
        type: Number,
        require: true
    },
    code: {
        type: String,
        require: true
    }
}, { _id: false });

const exam = new mongoose.Schema({
    name: {
        type: String,
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
        required: true,
        default: 1
    },
    submissions: [studentAnswerSheetSchema],
    setting: {
        type: setting,
        required: true
    }
}, { timestamps: true });



module.exports = exam