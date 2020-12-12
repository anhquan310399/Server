const mongoose = require("mongoose");
const schema = mongoose.Schema({
    role: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    }
});


module.exports = mongoose.model("privilege", schema);