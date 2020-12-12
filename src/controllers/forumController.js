const User = require('../models/user');
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
        .then((data) => {
            res.send(timeline.forums[length - 1]);
        })
        .catch((err) => {
            const key = Object.keys(err.errors)[0];
            res.status(500).send({
                success: false,
                message: err.errors[key].message,
            });
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
            topics: await Promise.all(forum.topics.map(async function(value) {
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

exports.findAll = (req, res) => {
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

exports.update = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(function(value, index, arr) {
        if (value._id == req.params.idForum) {
            arr[index].name = req.body.data.name;
            arr[index].description = req.body.data.description;
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
                isDeleted: forum.isDeleted
            });
        })
        .catch((err) => {
            const key = Object.keys(err.errors)[0];
            res.status(500).send({
                success: false,
                message: err.errors[key].message,
            });
        });
};

exports.delete = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const forum = timeline.forums.find(value => value._id == req.params.idForum);
    if (!forum) {
        return res.status(404).send({
            message: "Not found forum",
        });
    }
    forum.isDeleted = true;


    data.save()
        .then((data) => {
            res.send({
                success: false,
                message: "Delete Successfully!"
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