const mongoose = require("mongoose");
const schema = mongoose.Schema({
    role: {
        type: String,
        unique: true,
        required: [true, 'role is required']
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'name of privilege is required']
    }
});


module.exports = mongoose.model("privilege", schema);