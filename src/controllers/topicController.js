const User = require('../models/user');

exports.create = async(req, res) => {

    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.body.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found forum",
        });
    }
    const model = {
        name: req.body.data.name,
        content: req.body.data.content,
        idUser: req.user._id
    };

    var length = forum.topics.push(model);
    console.log(forum.topics);

    data.save()
        .then(async function(data) {
            let topic = forum.topics[length - 1];
            let creator = await User.findById(topic.idUser, 'code firstName surName urlAvatar')
                .then(value => {
                    return value;
                })
            res.send({
                _id: topic._id,
                name: topic.name,
                content: topic.content,
                create: creator,
                createdAt: topic.createdAt,
                discussions: topic.discussions
            });
        })
        .catch((err) => {
            console.log("Create topic: ");
            console.log(err);
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

exports.find = async(req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.query.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found forum",
        });
    }

    const topic = forum.topics.find(value => value._id == req.params.idTopic)
    if (!topic) {
        return res.status(404).send({
            success: false,
            message: "Not found topic",
        });
    }
    var discussions = await Promise.all(topic.discussions.map(async function(value) {
        let creator = await User.findById(value.idUser, 'code firstName surName urlAvatar')
            .then(value => {
                return value;
            });
        return {
            id: value._id,
            content: value.content,
            create: creator,
            time: value.updatedAt,
            isChanged: value.createdAt.getTime() === value.updatedAt.getTime() ? false : true
        }
    }));

    let creator = await User.findById(topic.idUser, 'code firstName surName urlAvatar')
        .then(value => {
            return value;
        });

    res.send({
        _id: topic._id,
        name: topic.name,
        content: topic.content,
        create: creator,
        discussions: discussions,
        time: topic.createdAt
    });
};

exports.findAll = async(req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.body.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found forum",
        });
    }

    let topics = await Promise.all(
        forum.topics.map(async function(value) {
            let creator = await User.findById(value.idUser, 'code firstName surName urlAvatar')
                .then(value => {
                    return value;
                });
            return {
                _id: value.id,
                name: value.name,
                content: value.content,
                create: creator,
                time: value.updatedAt,
                relies: value.discussions.length
            }
        })
    )

    res.send(topics);

};

exports.update = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.body.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found forum",
        });
    }
    let isCreator = false;

    const topic = forum.topics.find(value => value._id == req.params.idTopic);

    if (!topic) {
        return res.status(404).send({
            success: false,
            message: "Not found topic",
        });
    } else if (topic.idUser == req.user._id) {
        topic.name = req.body.data.name;
        topic.content = req.body.data.content;
        isCreator = true;
    }



    if (isCreator) {
        data.save()
            .then(async function(data) {
                let creator = await User.findById(topic.idUser, 'code firstName surName urlAvatar')
                    .then(value => {
                        return value;
                    })
                res.send({
                    _id: topic.id,
                    name: topic.name,
                    content: topic.content,
                    create: creator,
                    time: topic.updatedAt,
                    relies: topic.discussions.length
                });
            })
            .catch((err) => {
                console.log("Update topic: ");
                console.log(err);
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
    } else {
        res.status(401).send({
            success: false,
            message: "You can't change this topic!"
        })
    }
};

exports.delete = (req, res) => {
    let data = req.subject
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.query.idForum);
    if (!forum) {
        return res.status(404).send({
            success: false,
            message: "Not found forum",
        });
    }

    const topic = forum.topics.find(value => value._id == req.params.idTopic);
    if (!topic) {
        return res.status(404).send({
            success: false,
            message: "Not found topic",
        });
    }

    if (topic.idUser != req.user._id) {
        return res.status(401).send({
            success: false,
            message: "You can't delete this topic!",
        });
    }

    const indexTopic = forum.topics.indexOf(topic);

    forum.topics.splice(indexTopic, 1);

    data.save()
        .then((data) => {
            res.send({
                success: false,
                message: "Delete topic successfully!"
            });
        })
        .catch((err) => {
            console.log("Delete topic: " + err.message);
            res.status(500).send({
                success: false,
                message: "Delete Failure"
            });
        });
};