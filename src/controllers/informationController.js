const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    const model = {
        name: req.body.data.name,
        description: req.body.data.description,
        content: req.body.data.content
    };
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            const index = data.timelines.indexOf(timeline);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            data.timelines[index].information.push(model);
            data.save()
                .then((data) => {
                    res.send(data.timelines[index]);
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

exports.find = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            const index = data.timelines.indexOf(timeline);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }

            const information = data.timelines[index].information.find(value => value._id == req.params.idInformation);

            res.send(information);
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
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            const index = data.timelines.indexOf(timeline);
            if (index === -1) {
                return res.status(404).send({
                    message: "Not found timeline",
                });
            }
            res.send(data.timelines[index].information);
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
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);

            const indexTimeline = data.timelines.indexOf(timeline);

            const information = data.timelines[indexTimeline].information.find(function(value, index, arr) {
                if (value._id == req.params.idInformation) {
                    arr[index].name = req.body.data.name;
                    arr[index].description = req.body.data.description;
                    arr[index].content = req.body.data.content;
                    return true;
                } else {
                    return false;
                }
            });

            data.save()
                .then((data) => {
                    res.send(information);
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
            const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
            const indexTimeline = data.timelines.indexOf(timeline);

            const information = data.timelines[indexTimeline].information.find(value => value._id == req.params.idInformation);
            const indexInfo = data.timelines[indexTimeline].information.indexOf(information);


            data.timelines[indexTimeline].information.splice(indexInfo, 1);
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