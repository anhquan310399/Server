const informationModel = require("../models/information");
const dbInformation = informationModel.informationModel;
const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    const model = new dbInformation({
        name: req.body.name,
        description: req.body.description,
        content: req.body.content
    });
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
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
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
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
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
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
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);

            const indexTimeline = data.timelines.indexOf(timeline);

            const information = data.timelines[indexTimeline].information.find(function(value, index, arr) {
                if (value._id == req.params.idInformation) {
                    arr[index].name = req.body.name;
                    arr[index].description = req.body.description;
                    arr[index].content = req.body.content;
                    return true;
                } else {
                    return false;
                }
            });

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

exports.delete = (req, res) => {
    dbSubject.findById(req.params.idSubject)
        .then((data) => {
            const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
            const indexTimeline = data.timelines.indexOf(timeline);

            const information = data.timelines[indexTimeline].information.find(value => value._id == idInformation);
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