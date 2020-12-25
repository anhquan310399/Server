const mongoose = require("mongoose");

const studentAnswerSheetSchema = require("./studentAnswerSheet")

const setting = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Code of chapter is required"]
    },
    questionCount: {
        type: Number,
        required: [true, "Amount questions of quiz is required"],
        min: [1, "Min of amount questions is 1"]
    },
    timeToDo: {
        type: Number,
        required: [true, "Time of quiz is required"],
        min: [0, "Min of time to do is 0"]
    },
    attemptCount: {
        type: Number,
        required: true,
        default: 1,
        min: [0, "Min of attempt count is 0"]
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
        required: [true, "Expire time of exam is required"],
        validate: [function(value) {
            return value >= this.startTime
        }, "Expire time must be more than start time"]
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