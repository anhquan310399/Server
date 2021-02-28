var mongoose = require("mongoose");

var discussionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Content of discussion is required!']
    },
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = discussionSchema