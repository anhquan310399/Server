const mongoose = require("mongoose");

const studentAnswerSheetSchema = require("./studentAnswerSheet")

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
    },
    attemptCount: {
        type: Number,
        required: true,
        default: 1
    }
}, { _id: false });

const exam = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
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
    submissions: [studentAnswerSheetSchema],
    setting: {
        type: setting,
        required: true
    }
}, { timestamps: true });



module.exports = exam