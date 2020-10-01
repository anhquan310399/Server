const mongoose = require("mongoose");

const timeline = require("./timeline")
const timelineSchema = timeline.timelineSchema

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
    lectureId: {
        type: String,
        required: true
    },
    timelines: [timelineSchema],
    studentIds: [String]
}, {
    timestamps: true,
});

const timeLineModel = timeline.timelineModel

Schema.methods.createTimeline = async function(name, description) {
    const subject = this
    try {
        const timeLine = new timeLineModel({
            name: name,
            description: description
        });
        console.log(timeLine.name)
        console.log(timeLine.description)
        subject.timelines.push(timeLine);
        await subject.save()
        return true
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = mongoose.model("subject", Schema);