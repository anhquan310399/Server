const mongoose = require("mongoose");

const discussion = require("./discussion")
const discussionSchema = discussion.discussionSchema

const forum = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    discussions: [discussionSchema]
});


exports.forumSchema = forum

exports.forumModel = mongoose.model("forum", forum)