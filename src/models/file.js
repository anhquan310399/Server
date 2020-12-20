const mongoose = require("mongoose");


const file = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name of file is required!']
    },
    type: {
        type: String,
        require: [true, 'type of file is required!']
    },
    path: {
        type: String,
        require: [true, 'path of file is required']
    },
    uploadDay: {
        type: Date,
        default: Date.now()
    }
});


module.exports = file