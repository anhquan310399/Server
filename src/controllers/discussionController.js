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

            const forum = timeline.forums.find(value => value._id == req.body.idForum);
            if (!forum) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            const topic = forum.topics.find(value => value._id == req.body.idTopic);

            if (!topic) {
                return res.status(404).send({
                    message: "Not found topic",
                });
            }

            const model = {
                subject: req.body.data.subject,
                content: req.body.data.content,
                createId: req.userId,
                parentId: req.body.data.parentId
            };

            topic.discussions.push(model);

            data.save()
                .then((data) => {
                    res.send(topic.discussions);
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

            const topic = forum.topics.find(value => value._id == req.body.idTopic);

            if (!topic) {
                return res.status(404).send({
                    message: "Not found topic",
                });
            }

            const discussion = topic.discussions.find(value => value._id == req.params.idDiscussion)
            if (!discussion) {
                return res.status(404).send({
                    message: "Not found discussion",
                });
            }
            res.send(discussion);
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

            const topic = forum.topics.find(value => value._id == req.body.idTopic);

            if (!topic) {
                return res.status(404).send({
                    message: "Not found topic",
                });
            }

            res.send(topic.discussions);
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

            const topic = forum.topics.find(value => value._id == req.body.idTopic);

            if (!topic) {
                return res.status(404).send({
                    message: "Not found topic",
                });
            }

            const discussion = topic.discussions.find(function(value, index, arr) {
                if (value._id == req.params.idDiscussion) {
                    arr[index].subject = req.body.data.subject;
                    arr[index].content = req.body.data.content;
                    return true;
                } else {
                    return false;
                }
            });

            data.save()
                .then((data) => {
                    res.send(discussion);
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

            const topic = forum.topics.find(value => value._id == req.body.idTopic);

            if (!topic) {
                return res.status(404).send({
                    message: "Not found topic",
                });
            }

            const discussion = topic.discussions.find(value => value._id == req.params.idDiscussion);
            const indexDiscussion = topic.discussions.indexOf(discussion);
            if (indexDiscussion === -1) {
                return res.status(404).send({
                    message: "Not found discussion",
                });
            }


            topic.discussions.splice(indexDiscussion, 1);

            data.save()
                .then((data) => {
                    res.send(topic.discussions);
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