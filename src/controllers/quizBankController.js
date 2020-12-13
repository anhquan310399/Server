exports.createChapter = async(req, res) => {
    let data = req.subject;
    const model = {
        name: req.body.data.name,
    };
    let length = data.quizBank.push(model);
    await data.save()
        .then(() => {
            res.send(data.quizBank[length - 1]);
        })
        .catch((err) => {
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

exports.findAllChapter = async(req, res) => {
    let data = req.subject;
    let quizBank = await Promise.all(data.quizBank.map(value => {
        return {
            _id: value._id,
            name: value.name,
            questions: value.questions.length
        }
    }));
    res.send(quizBank);
};

exports.findChapter = async(req, res) => {
    let data = req.subject;
    const chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    res.send(chapter);
};

exports.updateChapter = async(req, res) => {
    let data = req.subject;
    let chapter = data.quizBank.find(function(value) {
        return value._id == req.params.idChapter
    });

    if (!chapter) {
        return res.status(404).send({
            message: "Not found question collection"
        })
    }
    chapter.name = req.body.data.name;

    await data.save()
        .then(() => {
            res.send({
                _id: chapter._id,
                name: chapter.name
            });
        })
        .catch((err) => {
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

exports.deleteChapter = async(req, res) => {
    let data = req.subject;
    const chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }

    const index = data.quizBank.indexOf(chapter);
    data.quizBank.splice(index, 1);
    await data.save()
        .then((data) => {
            res.send({ message: "Delete Successfully!" });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};


exports.pushQuestion = async(req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }
    var model = req.body.data.questions;
    await model.forEach(element => {
        chapter.questions.push(element);
    });
    await data.save()
        .then(() => {
            res.send(chapter);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.getAllQuestion = async(req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }

    res.send(chapter.questions);
};

exports.getQuestionById = async(req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }
    var question = chapter.questions.find(value => value._id == req.params.idQuestion);

    if (!question) {
        return res.status(404).send({
            message: "Not found question",
        });
    }

    res.send(question);
};


exports.updateQuestionById = async(req, res) => {
    let subject = req.subject;
    var chapter = subject.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }
    var question = chapter.questions.find(value => value._id == req.params.idQuestion);

    if (!question) {
        return res.status(404).send({
            message: "Not found question",
        });
    }
    let data = req.body.data;
    let answers = await Promise.all(data.answers.map(async(value) => {
        return { answer: value.answer, isCorrect: value.isCorrect };
    }));
    question = {
        question: data.question,
        answers: answers,
        typeQuestion: data.typeQuestion,
        explain: data.explain
    }
    await subject.save()
        .then(() => {
            return res.send(question);
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message,
            });
        });
};

exports.deleteQuestionById = async(req, res) => {
    let subject = req.subject;
    var chapter = subject.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found chapter",
        });
    }
    var question = chapter.questions.find(value => value._id == req.params.idQuestion);

    if (!question) {
        return res.status(404).send({
            message: "Not found question",
        });
    }

    let index = chapter.questions.indexOf(question);
    chapter.questions.splice(index, 1);

    await subject.save()
        .then(() => {
            return res.send({
                message: "Delete question successfully!"
            });
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message,
            });
        });
}