const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    let data = req.subject;

    const model = {
        name: req.body.data.name,
        description: req.body.data.description
    };

    var length = data.timelines.push(model);
    data.save()
        .then((data) => {
            res.send(data.timelines[length - 1]);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.findAll = (req, res) => {
    if (req.idPrivilege === 'student') {
        dbSubject.findOne({ _id: req.body.idSubject, isDeleted: false })
            .then((data) => {
                if (!data) {
                    return res.status(404).send({
                        message: "Not found",
                    });
                }
                res.send(data.timelines.map((value) => {
                    let forums = value.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description } });
                    let exams = value.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description } });
                    let information = value.exams.map((info) => { return { _id: info._id, name: info.name, description: info.description, content: info.content } });
                    let assignments = value.exams.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description } });
                    return { name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments };
                }));
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message,
                });
            });
    } else {
        dbSubject.findById(req.body.idSubject)
            .then((data) => {
                if (!data) {
                    return res.status(404).send({
                        message: "Not found",
                    });
                }
                res.send(data.timelines.map((value) => {
                    let forums = value.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description } });
                    let exams = value.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description } });
                    let information = value.exams.map((info) => { return { _id: info._id, name: info.name, description: info.description, content: info.content } });
                    let assignments = value.exams.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description } });
                    return {
                        name: value.name,
                        description: value.description,
                        forums: forums,
                        exams: exams,
                        information: information,
                        assignments: assignments,
                        isDeleted: value.isDeleted
                    };
                }));
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message,
                });
            });
    }
};

exports.find = (req, res) => {
    let timelines = req.subject.timelines;
    if (req.idPrivilege === 'student') {
        timelines.filter((value) => { if (value.isDeleted === false) return true });
    }
    let result = timelines.map((value) => {
        let forums = value.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description } });
        let exams = value.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description } });
        let information = value.exams.map((info) => { return { _id: info._id, name: info.name, description: info.description, content: info.content } });
        let assignments = value.exams.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description } });
        if (req.idPrivilege === 'student') {
            return { id: value._id, name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments };
        } else {
            return { id: value._id, name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments, isDeleted: value.isDeleted };
        }
    });
    res.send(result);
};

exports.update = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            const timeline = data.timelines.find(function(value, index, arr) {
                if (value._id == req.params.idTimeline) {
                    arr[index].name = req.body.data.name;
                    arr[index].description = req.body.data.description;
                    return true;
                } else {
                    return false;
                }
            });
            data.save()
                .then((data) => {
                    res.send(timeline);
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
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            const index = data.timelines.indexOf(timeline);
            data.timelines.splice(index, 1);
            data.save()
                .then((data) => {
                    res.send(data.timelines);
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