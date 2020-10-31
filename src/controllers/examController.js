const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            if (!timeline) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const model = {
                name: req.body.data.name,
                description: req.body.data.description,
                content: req.body.data.content,
                startTime: new Date(req.body.data.startTime),
                expireTime: new Date(req.body.data.expireTime),
                attemptCount: req.body.data.attemptCount,
                setting: req.body.data.setting
            };

            timeline.exams.push(model);
            data.save()
                .then((data) => {
                    res.send(timeline.exams);
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

exports.find = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            if (!timeline) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const exam = timeline.exams.find(value => value._id == req.params.idExam);
            if (!exam) {
                return res.status(404).send({
                    message: "Not found exam",
                });
            }
            res.send(exam);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.findAll = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            if (!timeline) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }
            res.send(timeline.exams);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.update = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            if (!timeline) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }
            const exam = timeline.exams.find(function(value, index, arr) {
                if (value._id == req.params.idExam) {
                    arr[index].name = req.body.data.name != null ? req.body.data.name : arr[index].name;
                    arr[index].description = req.body.data.description != null ? req.body.data.description : arr[index].description;
                    arr[index].content = req.body.data.content != null ? req.body.data.content : arr[index].content;
                    arr[index].startTime = req.body.data.startTime != null ? new Date(req.body.data.startTime) : arr[index].startTime;
                    arr[index].expireTime = req.body.data.expireTime != null ? new Date(req.body.data.expireTime) : arr[index].expireTime;
                    arr[index].setting = req.body.data.setting != null ? req.body.data.setting : arr[index].setting;
                    arr[index].attemptCount = req.body.data.attemptCount != null ? req.body.data.attemptCount : arr[index].attemptCount;
                    return true;
                } else {
                    return false;
                }
            });

            data.save()
                .then((data) => {
                    res.send(exam);
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
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            if (!timeline) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }
            const exam = timeline.exams.find(value => value._id == req.params.idExam);
            const indexExam = timeline.exams.indexOf(exam);


            timeline.exams.splice(indexExam, 1);
            data.save()
                .then((data) => {
                    res.send(timeline.exams);
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