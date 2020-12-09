const mongoose = require("mongoose");

const informationSchema = require("./information");

const forumSchema = require("./forum");

const assignmentSchema = require("./assignment");

const examSchema = require("./exam");

const fileSchema = require('./file');

const timeline = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tiều đề']
    },
    description: String,
    forums: [forumSchema],
    exams: [examSchema],
    information: [informationSchema],
    assignments: [assignmentSchema],
    files: [fileSchema],
    isDeleted: {
        type: Boolean,
        default: false
    },
    index: {
        type: mongoose.Schema.Types.Number,
        min: 1,
        required: true
    }

}, {
    timestamps: true,
});



module.exports = timeline