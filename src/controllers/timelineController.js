const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    const model = {
        name: req.body.data.name,
        description: req.body.data.description
    };
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            data.timelines.push(model);
            data.save()
                .then((data) => {
                    res.send(data);
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

exports.findAll = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(data.timelines);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.find = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            res.send(timeline);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
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