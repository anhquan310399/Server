const mongoose = require("mongoose");

const information = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    content: {
        type: String,
        required: true
    }
});

exports.informationSchema = information

exports.informationModel = mongoose.model("information", information)