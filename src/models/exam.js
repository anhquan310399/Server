const mongoose = require("mongoose");

const studentAnswerSheetSchema = require("./studentAnswerSheet")

const setting = new mongoose.Schema({
    questionCount: {
        type: Number,
        required: [true, "Amount questions of quiz is required"]
    },
    timeToDo: {
        type: Number,
        required: [true, "Time of quiz is required"]
    },
    code: {
        type: String,
        required: [true, "Code of chapter is required"]
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
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

exam.pre('save', async function(next) {
    let currentExam = this;
    if (currentExam.isNew) {
        console.log("Create new exam!");
        let timeline = currentExam.parent();
        let subject = timeline.parent();
        if (!subject.transcript) {
            subject.transcript = [];
        }
        subject.transcript = subject.transcript.concat({ idField: currentExam._id });
    }
})


module.exports = exam