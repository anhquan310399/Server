const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    subjects: [String]
}, {
    timestamps: true,
}, { _id: false });

module.exports = mongoose.model("course", Schema);