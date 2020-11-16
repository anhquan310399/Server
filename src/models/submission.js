const mongoose = require("mongoose");
const file = require("./file");


const feedBack = new mongoose.Schema({
    grade: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    gradeOn: {
        type: Date,
        required: true
    },
    gradeBy: {
        type: String,
        required: true
    }
}, { _id: false });

const submission = new mongoose.Schema({
    idUser: {
        type: String,
        required: true
    },
    file: [file],
    submitTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
    feedBack: feedBack
});
module.exports = submission