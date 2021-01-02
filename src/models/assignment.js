const mongoose = require("mongoose");
const file = require('./file');

//Thêm trường comment để khiếu nại điểm

const feedBack = new mongoose.Schema({
    grade: {
        type: Number,
        required: [true, "Grade is required!"],
        min: [0, "Min grade is 0!"],
        max: [10, "Max grade is 10!"]
    },
    gradeOn: {
        type: Date,
        required: true
    },
    gradeBy: {
        type: String,
        required: true
    },
    comment: String
}, { _id: false });

const submission = new mongoose.Schema({
    idStudent: {
        type: String,
        required: true
    },
    file: {
        type: file,
        required: [true, "Vui lòng thêm file"],
    },
    submitTime: {
        type: Date,
        default: Date.now()
    },
    feedBack: feedBack
});

const setting = new mongoose.Schema({
    startTime: {
        type: Date,
        required: [true, "Start time of assignment is required"]
    },
    expireTime: {
        type: Date,
        required: [true, "Expire time of assignment is required"],
        validate: [function(value) {
            return value >= this.startTime
        }, "Expire time must be more than start time"]
    },
    isOverDue: {
        type: Boolean,
        default: false
    },
    overDueDate: {
        type: Date,
        required: [function() {
            return this.isOverDue;
        }, "Over due date is required"],
        validate: [function(value) {
            return value > this.expireTime
        }, "Over due date must be more than expire time"]
    },
    fileSize: {
        type: Number,
        min: [5, "Min size of file is 5mb"],
        max: [500, "Max size of file is 500mb"],
        default: 5
    }

}, { _id: false });

const assignmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Title of assignment is required"]
    },
    content: {
        type: String,
        required: [true, "Description of assignment is required"]
    },
    attachments: {
        type: [file]
    },
    setting: {
        type: setting,
        required: [true, "Setting of assignment is required"]
    },
    submissions: [submission],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


assignmentSchema.pre('save', async function(next) {
    let currentAssignment = this;
    if (currentAssignment.isNew) {
        console.log("Create new assignment!");
        let timeline = currentAssignment.parent();
        let subject = timeline.parent();
        if (!subject.transcript) {
            subject.transcript = [];
        }
        subject.transcript = subject.transcript.concat({ idField: currentAssignment._id });
    }
});

module.exports = assignmentSchema