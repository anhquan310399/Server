const mongoose = require("mongoose");

const timelineSchema = require("./timeline");

const questionModel = require('./question');

const chapter = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    questions: [questionModel]
});

const Schema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lectureId: {
        type: String,
        required: true
    },
    timelines: [timelineSchema],
    studentIds: [String],
    quizBank: [chapter],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

Schema.pre('save', function(next) {
    var subject = this;
    if (subject.isModified('studentIds')) {
        subject.studentIds = subject.studentIds.sort();
    }
    next();
});

module.exports = mongoose.model("subject", Schema);