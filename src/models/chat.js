var mongoose = require("mongoose");


var message = mongoose.Schema({
    content: {
        type: String,
        require: true,
    },
    idUser: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        default: new Date()
    }
})

var chat = mongoose.Schema({
    messages: {
        type: [message]
    },
    users: {
        type: [String],
        require: true
    }
});


module.exports = mongoose.model("chat", chat);