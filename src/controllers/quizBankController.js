const { model } = require("../models/subject");
const dbSubject = require("../models/subject");

exports.createChapter = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            const model = {
                name: req.body.data.name,
            };
            data.quizBank.push(model);
            data.save()
                .then((data) => {
                    var length = data.quizBank.length;
                    res.send(data.quizBank[length - 1]);
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

exports.findAllChapter = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            console.log(data);
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(data.quizBank);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.findChapter = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            const chapter = data.quizBank.find(value => value._id == req.params.idChapter);
            res.send(chapter);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.updateChapter = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            const chapter = data.quizBank.find(function(value, index, arr) {
                if (value._id == req.params.idChapter) {
                    arr[index].name = req.body.data.name;
                    return true;
                } else {
                    return false;
                }
            });
            data.save()
                .then((data) => {
                    res.send(chapter);
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

exports.deleteChapter = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            const chapter = data.quizBank.find(value => value._id == req.params.idChapter);
            if (!chapter) {
                return res.status(404).send({
                    message: "Not found",
                });
            }

            const index = data.quizBank.indexOf(chapter);
            data.quizBank.splice(index, 1);
            data.save()
                .then((data) => {
                    res.send(data.quizBank);
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


exports.pushQuestion = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }

            var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
            if (!chapter) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            var model = req.body.data.questions;
            model.forEach(element => {
                chapter.questions.push(element);
            });
            data.save()
                .then((data) => {
                    res.send(chapter);
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

exports.getQuestion = (req, res) => {
    dbSubject.findById(req.body.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
            if (!chapter) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(chapter.questions);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};