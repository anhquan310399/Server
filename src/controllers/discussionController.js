const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    const model = {
        subject: req.body.subject,
        content: req.body.content,
        createId: req.userId,
        parentId: req.body.parentId
    };
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            const index = data.timelines.indexOf(timeline);
            console.log("index timeline " + index);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const forum = data.timelines[index].forums.find(value => value._id == req.params.idForum);
            const indexForum = data.timelines[index].forums.indexOf(forum);
            console.log("index forum " + index);

            if (indexForum === -1) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }
            data.timelines[index].forums[indexForum].discussions.push(model);

            data.save()
                .then((data) => {
                    res.send(data.timelines[index].forums[indexForum].discussions);
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
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            const index = data.timelines.indexOf(timeline);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const forum = data.timelines[index].forums.find(value => value._id == req.params.idForum);
            const indexForum = data.timelines[index].forums.indexOf(forum);
            if (indexForum === -1) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            const discussion = data.timelines[index].forums[indexForum].discussions.find(value => value._id == req.params.idDiscussion)
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
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            const index = data.timelines.indexOf(timeline);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const forum = data.timelines[index].forums.find(value => value._id == req.params.idForum);
            const indexForum = data.timelines[index].forums.indexOf(forum);
            if (indexForum === -1) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            res.send(data.timelines[index].forums[indexForum].discussions);
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
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            const indexTimeline = data.timelines.indexOf(timeline);
            if (indexTimeline === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const forum = data.timelines[indexTimeline].forums.find(value => value._id == req.params.idForum);
            const indexForum = data.timelines[indexTimeline].forums.indexOf(forum);
            if (indexForum === -1) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            data.timelines[indexTimeline].forums[indexForum].discussions.find(function(value, index, arr) {
                if (value._id == req.params.idDiscussion) {
                    arr[index].subject = req.body.subject;
                    arr[index].content = req.body.content;
                    return true;
                } else {
                    return false;
                }
            });

            data.save()
                .then((data) => {
                    res.send(data.timelines[indexTimeline].forums[indexForum].discussions);
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
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            const indexTimeline = data.timelines.indexOf(timeline);
            if (indexTimeline === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const forum = data.timelines[indexTimeline].forums.find(value => value._id == req.params.idForum);
            const indexForum = data.timelines[indexTimeline].forums.indexOf(forum);
            if (indexForum === -1) {
                return res.status(404).send({
                    message: "Not found forum",
                });
            }

            const discussion = data.timelines[indexTimeline].forums[indexForum].discussions.find(value => value._id == req.params.idDiscussion);
            const indexDiscussion = data.timelines[indexTimeline].forums[indexForum].discussions.indexOf(discussion);
            if (indexDiscussion === -1) {
                return res.status(404).send({
                    message: "Not found discussion",
                });
            }


            data.timelines[indexTimeline].forums[indexForum].discussions.splice(indexDiscussion, 1);
            data.save()
                .then((data) => {
                    res.send(data.timelines[indexTimeline].forums[indexForum].discussions);
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