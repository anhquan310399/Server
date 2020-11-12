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
        create: {
            id: req.user._id,
            urlAvatar: req.user.urlAvatar,
            name: req.user.surName + " " + req.user.firstName
        }
    };

    var length = topic.discussions.push(model);

    data.save()
        .then(() => {
            let discussion = topic.discussions[length - 1];
            res.send({
                id: discussion._id,
                content: discussion.content,
                create: discussion.create,
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
    console.log(discussion);
    res.send({
        id: discussion._id,
        content: discussion.content,
        create: discussion.create,
        time: discussion.updatedAt,
        isChanged: discussion.createdAt === discussion.updatedAt ? false : true
    });
};

exports.findAll = (req, res) => {
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

    var result = topic.discussions.map((value) => {
        return {
            id: value._id,
            content: value.content,
            create: value.create,
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
            if (value.create.id === req.user._id) {
                arr[index].subject = req.body.data.subject;
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
                res.send({
                    id: discussion._id,
                    content: discussion.content,
                    create: discussion.create,
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