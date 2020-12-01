const mongoose = require("mongoose");

const informationSchema = require("./information");

const forumSchema = require("./forum");

const assignmentSchema = require("./assignment");

const examSchema = require("./exam");

const timeline = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    forums: [forumSchema],
    exams: [examSchema],
    information: [informationSchema],
    assignments: [assignmentSchema],
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