const User = require('../models/user');

exports.create = async(req, res) => {
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

    await data.save()
        .then(async function() {
            let discussion = topic.discussions[length - 1];
            let creator = await User.findById(discussion.idUser, 'code firstName surName urlAvatar').then(value => { return value });
            res.send({
                id: discussion._id,
                content: discussion.content,
                create: creator,
                time: discussion.updatedAt,
                isChanged: discussion.createdAt.getTime() === discussion.updatedAt.getTime() ? false : true
            });
        })
        .catch((err) => {
            console.log("Create discussion: ");
            console.log(err);
            const key = Object.keys(err.errors)[0];
            res.status(500).send({
                message: err.errors[key].message,
            });
        });
};

exports.find = async(req, res) => {
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
    let creator = await User.findById(discussion.idUser, 'code firstName surName urlAvatar').then(value => { return value });

    res.send({
        id: discussion._id,
        content: discussion.content,
        create: creator,
        time: discussion.updatedAt,
        isChanged: discussion.createdAt.getTime() === discussion.updatedAt.getTime() ? false : true
    });
};

exports.findAll = async(req, res) => {
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

    var result = await Promise.all(topic.discussions.map(async function(discussion) {
        let creator = await User.findById(discussion.idUser, 'code firstName surName urlAvatar').then(value => { return value });
        return {
            id: discussion._id,
            content: discussion.content,
            create: creator,
            time: discussion.updatedAt,
            isChanged: discussion.createdAt.getTime() === discussion.updatedAt.getTime() ? false : true
        }
    }))

    res.send(result);

};

exports.update = async(req, res) => {
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
        await data.save()
            .then(async() => {
                let creator = await User.findById(discussion.idUser, 'code firstName surName urlAvatar').then(value => { return value });
                res.send({
                    id: discussion._id,
                    content: discussion.content,
                    create: creator,
                    time: discussion.updatedAt,
                    isChanged: discussion.createdAt === discussion.updatedAt ? false : true
                });
            })
            .catch((err) => {
                console.log("Update discussion: ");
                console.log(err);
                const key = Object.keys(err.errors)[0];
                res.status(500).send({
                    message: err.errors[key].message,
                });
            });
    } else {
        res.status(500).send({
            message: "You can't change this discussion!"
        });
    }
};

exports.delete = async(req, res) => {
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

    const discussion = topic.discussions
        .find((value) => {
            return (value._id == req.params.idDiscussion)
        });
    if (!discussion) {
        return res.status(401).send("Not found discussion!");
    } else {
        if (discussion.idUser != req.user._id) {
            return res.status(401).send({ message: "You can't delete this discussion!" });
        } else {
            let index = topic.discussions.indexOf(discussion);
            topic.discussions.splice(index, 1);
            await data.save()
                .then(() => {
                    res.send({ message: "Delete Successfully!" });
                })
                .catch((err) => {
                    console.log("Delete discussion:" + err.message);
                    res.status(500).send({
                        message: "Delete Failure!"
                    });
                });
        }
    }
};