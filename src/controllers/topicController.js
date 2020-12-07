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
            let creator = await User.findById(topic.idUser, 'firstName surName urlAvatar')
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
            const key = Object.keys(err.errors)[0];
            res.status(500).send({
                message: err.errors[key].message,
            });
        });


};

exports.find = async(req, res) => {
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

    const topic = forum.topics.find(value => value._id == req.params.idTopic)
    if (!topic) {
        return res.status(404).send({
            message: "Not found topic",
        });
    }
    var discussions = await Promise.all(topic.discussions.map(async function(value) {
        let creator = await User.findById(value.idUser, 'firstName surName urlAvatar')
            .then(value => {
                return value;
            })
        return {
            id: value._id,
            content: value.content,
            create: creator,
            time: value.updatedAt,
            isChanged: value.createdAt === value.updatedAt ? false : true
        }
    }));

    let creator = await User.findById(topic.idUser, 'firstName surName urlAvatar')
        .then(value => {
            return value;
        });

    res.send({
        _id: topic._id,
        name: topic.name,
        content: topic.content,
        create: creator,
        discussions: discussions,
        time: topic.updatedAt
    });
};

exports.findAll = async(req, res) => {
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

    let topics = await Promise.all(
        forum.topics.map(async function(value) {
            let creator = await User.findById(value.idUser, 'firstName surName urlAvatar')
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
            if (req.user._id === value.idUser) {
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
            .then(async function(data) {
                let creator = await User.findById(topic.idUser, 'firstName surName urlAvatar')
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
                const key = Object.keys(err.errors)[0];
                res.status(500).send({
                    message: err.errors[key].message,
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
            res.send({ message: "Delete topic successfully!" });
        })
        .catch((err) => {
            console.log("Delete topic: " + err.message);
            res.status(500).send({
                message: "Delete Failure"
            });
        });
};