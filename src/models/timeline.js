const mongoose = require("mongoose");

const information = require("./information")
const informationSchema = information.informationSchema

const forum = require("./forum")
const forumSchema = forum.forumSchema

const assignment = require("./assignment")
const assignmentSchema = assignment.assignmentSchema

const exam = require("./exam")
const examSchema = exam.examSchema


const timeline = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    forums: [forumSchema],
    exams: [examSchema],
    information: [informationSchema],
    assignments: [assignmentSchema]

}, {
    timestamps: true,
});



exports.timelineSchema = timeline