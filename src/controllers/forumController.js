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
        description: req.body.data.description
    };

    const length = timeline.forums.push(model);

    data.save()
        .then((data) => {
            res.send(timeline.forums[length - 1]);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
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
    const forum = timeline.forums.find(value => value._id == req.params.idForum);
    if (!forum) {
        return res.status(404).send({
            message: "Not found discussion",
        });
    }

    if (req.idPrivilege === 'student') {
        if (forum.isDeleted === true) {
            res.status(404).send('Not found forum!');
        } else {
            res.send({
                _id: forum._id,
                name: forum.name,
                description: forum.description,
                topics: forum.topics.map((value) => {
                    return {
                        _id: value._id,
                        name: value.name,
                        createId: value.createId,
                        replies: value.discussions.length
                    }
                })
            });
        }
    } else {
        res.send({
            _id: forum._id,
            name: forum.name,
            description: forum.description,
            topics: forum.topics.map((value) => {
                return {
                    _id: value._id,
                    name: value.name,
                    createId: value.createId,
                    replies: value.discussions.length
                }
            }),
            isDeleted: forum.isDeleted
        })
    }
};

exports.findAll = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    let index = data.timelines.indexOf(timeline);
    let forums = data.timelines[index].forums;
    if (req.idPrivilege === 'student') {
        res.send(forums.reduce((res, value) => {
            if (!value.isDeleted) {
                res.push({
                    _id: value._id,
                    name: value.name,
                    description: value.description
                })
            }
            return res;
        }, []));
    } else {
        res.send(forums.map((value) => {
            return {
                _id: value._id,
                name: value.name,
                description: value.description,
                isDeleted: value.isDeleted
            }
        }))
    }
};

exports.update = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(function(value, index, arr) {
        if (value._id == req.params.idForum) {
            arr[index].name = req.body.data.name || arr[index].name;
            arr[index].description = req.body.data.description || arr[index].description;
            return true;
        } else {
            return false;
        }
    });

    data.save()
        .then((data) => {
            res.send({
                _id: forum._id,
                name: forum.name,
                description: forum.description,
                topics: forum.topics.map((value) => {
                    return {
                        _id: value._id,
                        name: value.name,
                        createId: value.createId,
                        replies: value.discussions.length
                    }
                }),
                isDeleted: forum.isDeleted
            });
        })
        .catch((err) => {
            console.log("Update Forum: " + err.message);
            res.status(500).send({
                message: "Update Forum Failure!"
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
    const indexTimeline = data.timelines.indexOf(timeline);
    const forum = data.timelines[indexTimeline].forums.find(value => value._id == req.params.idForum);
    // const indexForum = data.timelines[indexTimeline].forums.indexOf(forum);
    if (!forum) {
        return res.status(404).send({
            message: "Not found forum",
        });
    }
    forum.isDeleted = true;


    data.save()
        .then((data) => {
            res.send("Delete Successfully!");
        })
        .catch((err) => {
            console.log("Delete forum: " + err.message);
            res.status(500).send({
                message: "Delete Failure!"
            });
        });

};