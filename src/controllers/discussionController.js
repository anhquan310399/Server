const User = require('../models/user');

exports.create = (req, res) => {
    let data = req.subject;
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
        content: req.body.data.content,
        idUser: req.user._id
    };

    var length = topic.discussions.push(model);

    data.save()
        .then(() => {
            let discussion = topic.discussions[length - 1];
            let creator = User.findById(discussion.idUser, 'firstName surName urlAvatar').then(value => { return value });
            res.send({
                id: discussion._id,
                content: discussion.content,
                create: creator,
                time: discussion.updatedAt,
                isChanged: discussion.createdAt === discussion.updatedAt ? false : true
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.find = (req, res) => {
    let data = req.subject
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.query.idForum);
    if (!forum) {
        return res.status(404).send({
            message: "Not found forum",
        });
    }

    const topic = forum.topics.find(value => value._id == req.query.idTopic);

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
    console.log(discussion);
    res.send({
        id: discussion._id,
        content: discussion.content,
        create: discussion.idUser,
        time: discussion.updatedAt,
        isChanged: discussion.createdAt === discussion.updatedAt ? false : true
    });
};

exports.findAll = (req, res) => {
    let data = req.subject
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.query.idForum);
    if (!forum) {
        return res.status(404).send({
            message: "Not found forum",
        });
    }

    const topic = forum.topics.find(value => value._id == req.query.idTopic);

    if (!topic) {
        return res.status(404).send({
            message: "Not found topic",
        });
    }

    var result = topic.discussions.map(async function(value) {
        let creator = await User.findById(value.idUser, 'firstName surName urlAvatar').then(value => { return value });
        return {
            id: value._id,
            content: value.content,
            create: creator,
            time: value.updatedAt,
            isChanged: value.createdAt === value.updatedAt ? false : true
        }
    })

    res.send(result);

};

exports.update = (req, res) => {
    let data = req.subject
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

    let isTrueCreate = true;

    const discussion = topic.discussions.find(function(value, index, arr) {
        if (value._id == req.params.idDiscussion) {
            if (value.idUser === req.user._id) {
                arr[index].content = req.body.data.content;
            } else {
                isTrueCreate = false;
            }
            return true;
        } else {
            return false;
        }
    });

    if (isTrueCreate) {
        data.save()
            .then(() => {
                let creator = User.findById(discussion.idUser, 'firstName surName urlAvatar').then(value => { return value });
                res.send({
                    id: discussion._id,
                    content: discussion.content,
                    create: creator,
                    time: discussion.updatedAt,
                    isChanged: discussion.createdAt === discussion.updatedAt ? false : true
                });
            })
            .catch((err) => {
                console.log("Update discussion:" + err.message);
                res.status(500).send({
                    message: "Update Failure!"
                });
            });
    } else {
        res.status(500).send({
            message: "You can't change this discussion!"
        });
    }
};

exports.delete = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.query.idForum);
    if (!forum) {
        return res.status(404).send({
            message: "Not found forum",
        });
    }

    const topic = forum.topics.find(value => value._id == req.query.idTopic);

    if (!topic) {
        return res.status(404).send({
            message: "Not found topic",
        });
    }

    let isExist = false;
    let isTrueCreate = false;

    const discussion = topic.discussions
        .filter((value) => {
            if (value._id == req.params.idDiscussion) {
                isExist = true;
                if (value.create.id === req.user._id) {
                    isTrueCreate = true;
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        });

    if (isExist) {
        if (isTrueCreate) {
            topic.discussions = discussion;
            data.save()
                .then(() => {
                    res.send("Delete Successfully!");
                })
                .catch((err) => {
                    console.log("Delete discussion:" + err.message);
                    res.status(500).send({
                        message: "Delete Failure!"
                    });
                });
        } else {
            res.status(401).send("You can't delete this discussion!");
        }
    } else {
        res.status(401).send("Not found discussion!");
    }
};