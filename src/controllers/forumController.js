const User = require('../models/user');
const isToday = require('../common/isToday');

exports.create = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const model = {
        name: req.body.data.name,
        description: req.body.data.description
    };

    const length = timeline.forums.push(model);

    data.save()
        .then(() => {
            const forum = timeline.forums[length - 1];
            res.send({
                success: true,
                message: 'Create new forum successfully!',
                forum: {
                    _id: forum.id,
                    name: forum.name,
                    description: forum.description,
                    time: forum.createdAt,
                    isNew: isToday(forum.updatedAt),
                    isDeleted: forum.isDeleted
                }
            });
        })
        .catch((err) => {
            console.log(err.name);
            if (err.name === 'ValidationError') {
                const key = Object.keys(err.errors)[0];
                res.status(400).send({
                    success: false,
                    message: err.errors[key].message,
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: err.message,
                });
            }
        });

};

exports.find = async (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    const forum = timeline.forums.find(value => value._id == req.params.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found discussion",
        });
    }

    if (req.idPrivilege === 'student' && forum.isDeleted === true) {
        res.status(404).send({
            success: false,
            message: "Not found forum",
        });
    } else {
        res.send({
            _id: forum._id,
            name: forum.name,
            description: forum.description,
            topics: await Promise.all(forum.topics.map(async function (value) {
                let creator = await User.findById(value.idUser, 'code firstName surName urlAvatar')
                    .then(value => { return value });
                return {
                    _id: value._id,
                    name: value.name,
                    create: creator,
                    replies: value.discussions.length
                }
            }))
        })
    }
};

exports.findUpdate = async (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    const forum = timeline.forums.find(value => value._id == req.params.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found discussion",
        });
    }

    res.send({
        success: true,
        forum: {
            _id: forum.id,
            name: forum.name,
            description: forum.description,
            time: forum.createdAt,
            isNew: isToday(forum.updatedAt),
            isDeleted: forum.isDeleted
        }
    })
};

exports.findAll = async (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
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

exports.update = async (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.params.idForum);

    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found discussion",
        });
    }
    let data = req.body.data;
    if (subject.name) {
        forum.name = subject.name;
    }
    if (subject.description) {
        forum.description = subject.description;
    }
    if (subject.isDeleted) {
        forum.isDeleted = subject.isDeleted;
    }

    subject.save()
        .then(() => {
            res.send({
                success: true,
                message: 'Update forum successfully!',
                forum: {
                    _id: forum.id,
                    name: forum.name,
                    description: forum.description,
                    time: forum.createdAt,
                    isNew: isToday(forum.updatedAt),
                    isDeleted: forum.isDeleted
                }
            });
        })
        .catch((err) => {
            console.log(err.name);
            if (err.name === 'ValidationError') {
                const key = Object.keys(err.errors)[0];
                res.status(400).send({
                    success: false,
                    message: err.errors[key].message,
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: err.message,
                });
            }
        });
};

exports.hideOrUnhide = async (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.params.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found forum",
        });
    }
    forum.isDeleted = !forum.isDeleted;


    data.save()
        .then((data) => {
            let message;
            if (forum.isDeleted) {
                message = `Hide forum ${forum.name} successfully!`;
            } else {
                message = `Unhide forum ${forum.name} successfully!`;
            }
            res.send({
                success: true,
                message: message,
                forum: {
                    _id: forum.id,
                    name: forum.name,
                    description: forum.description,
                    time: forum.createdAt,
                    isNew: isToday(forum.updatedAt),
                    isDeleted: forum.isDeleted
                }
            });
        })
        .catch((err) => {
            console.log("Delete forum: " + err.message);
            res.status(500).send({
                success: false,
                message: "Delete Failure!"
            });
        });

};

exports.delete = async (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.params.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found forum",
        });
    }
    let index = timeline.forums.indexOf(forum);

    timeline.forums.splice(index, 1);
    data.save()
        .then((data) => {
            res.send({
                success: true,
                message: "Delete forum successfully!"
            });
        })
        .catch((err) => {
            console.log("Delete forum: " + err.message);
            res.status(500).send({
                success: false,
                message: "Delete Failure!"
            });
        });

};