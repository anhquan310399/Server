const mongoose = require("mongoose");

const PrivilegeSchema = mongoose.Schema({
    _id: String,
    name: String,
}, {
    timestamps: true,
}, { _id: false });

module.exports = mongoose.model("Privilege", PrivilegeSchema);