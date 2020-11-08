const mongoose = require("mongoose");

const timelineSchema = require("./timeline");

const questionModel = require('./question');

const chapter = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    questions: [questionModel]
});

const Schema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lectureId: {
        type: String,
        required: true
    },
    timelines: [timelineSchema],
    studentIds: [String],
    quizBank: [chapter]
}, {
    timestamps: true
});

Schema.methods.createTimeline = async function(name, description) {
    const subject = this
    try {
        const timeLine = {
            name: name,
            description: description
        };
        subject.timelines.push(timeLine);
        await subject.save()
        return true
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = mongoose.model("subject", Schema);