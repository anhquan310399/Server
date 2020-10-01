const mongoose = require("mongoose");
const schema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true,
    _id: false
});


module.exports = mongoose.model("privilege", schema);