const timelineModel = require("../models/timeline");
const dbTimeline = timelineModel.timelineModel;
const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    const model = new dbTimeline({
        name: req.body.name,
        description: req.body.description
    });
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            data.timelines.push(model);
            data.save()
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message,
                    });
                });
        });
};

exports.findAll = (req, res) => {
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            res.send(data.timelines);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.find = (req, res) => {
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            res.send(timeline);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.update = (req, res) => {
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            const timeline = data.timelines.find(function(value, index, arr) {
                if (value._id == req.params.idTimeline) {
                    arr[index].name = req.body.name;
                    arr[index].description = req.body.description;
                    return true;
                } else {
                    return false;
                }
            });
            data.save()
                .then((data) => {
                    res.send(timeline);
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message,
                    });
                });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.delete = (req, res) => {
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            const index = data.timelines.indexOf(timeline);
            data.timelines.splice(index, 1);
            data.save()
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message,
                    });
                });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};