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
                expireTime: new Date(req.body.data.expireTime)
            };

            timeline.assignments.push(model);

            data.save()
                .then((data) => {
                    res.send(timeline.assignments);
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
            const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
            if (!assignment) {
                return res.status(404).send({
                    message: "Not found assignment",
                });
            }
            res.send(assignment);
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
            res.send(timeline.assignments);
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

            const assignment = timeline.assignments.find(function(value, index, arr) {
                if (value._id == req.params.idAssignment) {
                    arr[index].name = req.body.data.name != null ? req.body.data.name : arr[index].name;
                    arr[index].description = req.body.data.description != null ? req.body.data.description : arr[index].description;
                    arr[index].content = req.body.data.content != null ? req.body.data.content : arr[index].content;
                    arr[index].startTime = req.body.data.startTime != null ? new Date(req.body.data.startTime) : arr[index].startTime;
                    arr[index].expireTime = req.body.data.expireTime != null ? new Date(req.body.data.expireTime) : arr[index].expireTime;
                    return true;
                } else {
                    return false;
                }
            });

            data.save()
                .then((data) => {
                    res.send(assignment);
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

exports.submit = (req, res) => {
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

            const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
            if (!assignment) {
                return res.status(404).send({
                    message: "Not found assignment",
                });
            }

            var submission = {
                name: req.body.data.name,
                link: req.body.data.link,
                uploadDay: Date.now(),
                type: req.body.data.type,
                idUser: req.idStudent
            }

            assignment.submission.push(submission);


            data.save()
                .then((data) => {
                    res.send(assignment.submission);
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

            const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
            const indexAssignment = timeline.assignments.indexOf(assignment);
            if (indexAssignment === -1) {
                return res.status(404).send({
                    message: "Not found assignment",
                });
            }


            timeline.assignments.splice(indexAssignment, 1);

            data.save()
                .then((data) => {
                    res.send(timeline.assignments);
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