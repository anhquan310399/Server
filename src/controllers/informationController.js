const subject = require("../models/subject");
const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const model = {
        name: req.body.data.name,
        content: req.body.data.content
    };

    var length = timeline.information.push(model);

    data.save()
        .then(() => {
            res.send(timeline.information[length - 1]);
        })
        .catch((err) => {
            console.log("Create information: " + err.message);
            res.status(500).send({
                message: "Create information Failure!"
            });
        });
};

exports.find = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const information = timeline.information.find(value => value._id == req.params.idInformation);

    res.send(information);
};

exports.findAll = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    res.send(timeline.information);
};

exports.update = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    const information = timeline.information.find(function(value, index, arr) {
        if (value._id == req.params.idInformation) {
            arr[index].name = req.body.data.name || arr[index].name;
            arr[index].content = req.body.data.content || arr[index].content;
            return true;
        } else {
            return false;
        }
    });

    data.save()
        .then(() => {
            res.send(information);
        })
        .catch((err) => {
            console.log("Update information: " + err.message);
            res.status(500).send({
                message: "Update information failure!"
            });
        });

};

exports.delete = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    const information = timeline.information.find(value => value._id == req.params.idInformation);
    const indexInfo = timeline.information.indexOf(information);
    if (indexInfo === -1) {
        return res.status(404).send({
            message: "Not found information",
        });
    }

    timeline.information.splice(indexInfo, 1);

    data.save()
        .then(() => {
            res.send("Delete successfully!");
        })
        .catch((err) => {
            console.log("Delete information: " + err.message);
            res.status(500).send({
                message: "Delete failure!"
            });
        });
};