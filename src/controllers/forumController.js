const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    const model = {
        name: req.body.data.name,
        description: req.body.data.description
    };
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            const index = data.timelines.indexOf(timeline);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            data.timelines[index].forums.push(model);
            data.save()
                .then((data) => {
                    res.send(data.timelines[index]);
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
            const index = data.timelines.indexOf(timeline);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const forum = data.timelines[index].forums.find(value => value._id == req.params.idForum);
            if (!forum) {
                return res.status(404).send({
                    message: "Not found discussion",
                });
            }
            res.send(forum);
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
            const index = data.timelines.indexOf(timeline);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }
            res.send(data.timelines[index].forums);
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
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);

            const indexTimeline = data.timelines.indexOf(timeline);

            const forum = data.timelines[indexTimeline].forums.find(function(value, index, arr) {
                if (value._id == req.params.idForum) {
                    arr[index].name = req.body.data.name;
                    arr[index].description = req.body.data.description;
                    return true;
                } else {
                    return false;
                }
            });

            data.save()
                .then((data) => {
                    res.send(forum);
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
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            const indexTimeline = data.timelines.indexOf(timeline);

            const forum = data.timelines[indexTimeline].forums.find(value => value._id == req.params.idForum);
            const indexForum = data.timelines[indexTimeline].forums.indexOf(forum);


            data.timelines[indexTimeline].forums.splice(indexForum, 1);
            data.save()
                .then((data) => {
                    res.send(data.timelines[indexTimeline].forums);
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