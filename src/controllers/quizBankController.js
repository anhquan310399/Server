const _ = require('lodash');

exports.createChapter = (req, res) => {
    let data = req.subject;
    const model = {
        name: req.body.data.name,
    };
    let length = data.quizBank.push(model);
    data.save()
        .then(() => {
            res.send(data.quizBank[length - 1]);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.findAllChapter = (req, res) => {
    let data = req.subject;
    res.send(data.quizBank.map(value => {
        return {
            _id: value._id,
            name: value.name,
            questions: value.questions.length
        }
    }));
};

exports.findChapter = (req, res) => {
    let data = req.subject;
    const chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    res.send(chapter);
};

exports.updateChapter = (req, res) => {
    let data = req.subject;
    const chapter = data.quizBank.find(function(value, index, arr) {
        if (value._id == req.params.idChapter) {
            arr[index].name = req.body.data.name;
            return true;
        } else {
            return false;
        }
    });
    data.save()
        .then(() => {
            res.send({
                _id: chapter._id,
                name: chapter.name
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.deleteChapter = (req, res) => {
    let data = req.subject;
    const chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }

    const index = data.quizBank.indexOf(chapter);
    data.quizBank.splice(index, 1);
    data.save()
        .then((data) => {
            res.send("Delete Successfully!");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};


exports.pushQuestion = (req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }
    var model = req.body.data.questions;
    model.forEach(element => {
        chapter.questions.push(element);
    });
    data.save()
        .then(() => {
            res.send(chapter);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.getQuestion = (req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }

    res.send(chapter.questions);
};