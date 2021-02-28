var mongoose = require("mongoose");

var informationSchema = require("./information");

var forumSchema = require("./forum");

var assignmentSchema = require("./assignment");

var examSchema = require("./exam");

var surveySchema = require("./survey");

var fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name of file is required!']
    },
    type: {
        type: String,
        required: [true, 'type of file is required!']
    },
    path: {
        type: String,
        required: [true, 'path of file is required']
    },
    uploadDay: {
        type: Date,
        default: new Date(),
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

var timeline = new mongoose.Schema({
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