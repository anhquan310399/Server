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
    const model = {
        name: req.body.data.name,
        content: req.body.data.content,
        create: {
            id: req.user._id,
            urlAvatar: req.user.urlAvatar,
            name: req.user.surName + " " + req.user.firstName
        }
    };

    var length = forum.topics.push(model);

    data.save()
        .then((data) => {
            res.send(forum.topics[length - 1]);
        })
        .catch((err) => {
            console.log("Create topic: " + err.message);
            res.status(500).send({
                message: "Create Topic Failure!"
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
    var discussions = topic.discussions.map((value) => {
        return {
            id: value._id,
            content: value.content,
            create: value.create,
            time: value.updatedAt,
            isChanged: value.createdAt === value.updatedAt ? false : true
        }
    })
    res.send({
        _id: topic._id,
        name: topic.name,
        content: topic.content,
        create: topic.create,
        discussions: discussions,
        time: topic.updatedAt
    });
};

exports.findAll = (req, res) => {
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

    res.send(forum.topics.map((value) => {
        return {
            _id: value.id,
            name: value.name,
            content: value.content,
            create: value.create,
            time: value.updatedAt,
            relies: value.discussions.length
        }
    }));

};

exports.update = (req, res) => {
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
    let isCreator = true;
    const topic = forum.topics.find(function(value, index, arr) {
        if (value._id == req.params.idTopic) {
            if (req.user._id === value.create.id) {
                arr[index].name = req.body.data.name;
                arr[index].content = req.body.data.content;
            } else {
                isCreator = false;
            }
            return true;
        } else {
            return false;
        }
    });

    if (isCreator) {
        data.save()
            .then((data) => {
                // res.send("Update topic successfully!");
                res.send({
                    _id: topic.id,
                    name: topic.name,
                    content: topic.content,
                    create: topic.create,
                    time: topic.updatedAt
                })
            })
            .catch((err) => {
                console.log("Update topic: " + err.message);
                res.status(500).send({
                    message: "Update topic failure!"
                });
            });
    } else {
        res.status(401).send({
            message: "You can't change this topic!"
        })
    }
};

exports.delete = (req, res) => {
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

    const topic = forum.topics.find(value => value._id == req.params.idTopic);
    const indexTopic = forum.topics.indexOf(topic);
    if (indexTopic === -1) {
        return res.status(404).send({
            message: "Not found topic",
        });
    }

    forum.topics.splice(indexTopic, 1);

    data.save()
        .then((data) => {
            res.send("Delete topic successfully!");
        })
        .catch((err) => {
            console.log("Delete topic: " + err.message);
            res.status(500).send({
                message: "Delete Failure"
            });
        });
};