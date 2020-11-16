const mongoose = require("mongoose");
const submission = require("./submission");

const assignment = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    content: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    expireTime: {
        type: Date,
        required: true
    },
    submission: [submission]
});
module.exports = assignment