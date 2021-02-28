var mongoose = require("mongoose");

var discussionSchema = require("./discussion");

var topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name of Topic is required"]
    },
    content: {
        type: String,
        required: [true, "Content of Topic is required"]
    },
    discussions: [discussionSchema],
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = topicSchema