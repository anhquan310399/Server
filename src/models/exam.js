const mongoose = require("mongoose");

const studentAnswerSheetSchema = require("./studentAnswerSheet")

const setting = new mongoose.Schema({
    questionCount: {
        type: Number,
        require: [true, "Amount questions of quiz is required"]
    },
    timeToDo: {
        type: Number,
        require: [true, "Time of quiz is required"]
    },
    code: {
        type: String,
        require: [true, "Code of chapter is required"]
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
        required: [true, "Name of exam is required"]
    },
    content: {
        type: String,
        required: [true, "Requirement of exam is required"]
    },
    startTime: {
        type: Date,
        required: [true, "Start time of exam is required"]
    },
    expireTime: {
        type: Date,
        required: [true, "Expire time of exam is required"]
    },
    submissions: [studentAnswerSheetSchema],
    setting: {
        type: setting,
        required: [true, "Setting of exam is required"]
    }
}, { timestamps: true });


module.exports = exam