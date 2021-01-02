const mongoose = require("mongoose");

const informationSchema = require("./information");

const forumSchema = require("./forum");

const assignmentSchema = require("./assignment");

const examSchema = require("./exam");

const fileSchema = require('./file');
const surveySchema = require("./survey");

const timeline = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Title of timeline is required']
    },
    description: String,
    surveys: [surveySchema],
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

// timeline.pre('save', async function(next) {
//     let currentTimeline = this;
//     if (!currentTimeline.isModified('isDeleted')) {
//         return next();
//     }

//     if (currentTimeline.isDeleted === true) {
//         currentTimeline.exams.forEach(element => {
//             element.isDeleted = true;
//         });
//         currentTimeline.assignments.forEach(element => {
//             element.isDeleted = true;
//         });
//         currentTimeline.forums.forEach(element => {
//             element.isDeleted = true;
//         });
//     } else {
//         currentTimeline.exams.forEach(element => {
//             element.isDeleted = false;
//         });
//         currentTimeline.assignments.forEach(element => {
//             element.isDeleted = false;
//         });
//         currentTimeline.forums.forEach(element => {
//             element.isDeleted = false;
//         });
//     }

// })



module.exports = timeline