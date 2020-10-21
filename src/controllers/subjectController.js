const db = require("../models/subject");

exports.create = (req, res) => {
    // Validate request
    const data = new db({
        _id: req.body._id,
        name: req.body.name,
        lectureId: req.body.lectureId,
        studentIds: req.body.studentIds,
        timelines: req.body.timelines
    });

    // Save Ads in the database
    data.save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating privilege.",
            });
        });
};

exports.findAll = (req, res) => {
    db.find()
        .then((data) => {
            var info = data.map(function(value) {
                return { _id: value._id, name: value.name, lectureId: value.lectureId };
            });
            res.send(info);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while listing subject.",
            });
        });
};

exports.find = (req, res) => {
    db.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(data);
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message,
            });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Lack of information",
        });
    }
    // Find ads and update it with the request body
    db.findByIdAndUpdate(
            req.params.idSubject, {
                name: req.body.name,
                lectureId: req.body.lectureId
            }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            return res.status(500).send({
                message: err.message,
            });
        });
};

exports.delete = (req, res) => {
    db.findByIdAndRemove(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send({ message: "Delete successfully!" });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            return res.status(500).send({
                message: "Could not delete",
            });
        });
};


exports.addAllStudents = (req, res) => {
    // Validate request
    db.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }

            var list = data.studentIds.concat(req.body).sort();
            list = list.filter((a, b) => list.indexOf(a) === b);
            data.studentIds = list;
            data.save()
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while adding students.",
                    });
                });
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message,
            });
        });
};