const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    const model = {
        name: req.body.data.name,
        content: req.body.data.content,
        idUser: req.idUser
    };
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

            const forum = timeline.forums.find(value => value._id == req.body.idForum);
            if (!forum) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            forum.topics.push(model);

            data.save()
                .then((data) => {
                    res.send(forum.topics);
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

            const forum = timeline.forums.find(value => value._id == req.body.idForum);
            if (!forum) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            const topic = forum.topics.find(value => value._id == req.params.idTopic)
            if (!topic) {
                return res.status(404).send({
                    message: "Not found topic",
                });
            }
            res.send(topic);
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

            const forum = timeline.forums.find(value => value._id == req.body.idForum);
            if (!forum) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            res.send(forum.topics);
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

            const forum = timeline.forums.find(value => value._id == req.body.idForum);
            if (!forum) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            const topic = forum.topics.find(function(value, index, arr) {
                if (value._id == req.params.idTopic) {
                    arr[index].name = req.body.data.name;
                    arr[index].content = req.body.data.content;
                    return true;
                } else {
                    return false;
                }
            });

            data.save()
                .then((data) => {
                    res.send(topic);
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

            const forum = timeline.forums.find(value => value._id == req.body.idForum);
            if (!forum) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            const topic = forum.topics.find(value => value._id == req.params.idTopic);
            const indexTopic = data.timelines[indexTimeline].forums[indexForum].topics.indexOf(topic);
            if (indexTopic === -1) {
                return res.status(404).send({
                    message: "Not found topic",
                });
            }

            forum.topics.splice(indexTopic, 1);

            data.save()
                .then((data) => {
                    res.send(forum.topics);
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