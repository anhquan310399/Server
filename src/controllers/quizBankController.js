exports.createChapter = async(req, res) => {
    let data = req.subject;
    var model = {
        name: req.body.data.name,
    };
    let length = data.quizBank.push(model);
    await data.save()
        .then(() => {
            res.send({
                success: true,
                chapter: data.quizBank[length - 1]
            });
        })
        .catch((err) => {
            console.log(err.name);
            if (err.name === 'ValidationError') {
                var key = Object.keys(err.errors)[0];
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
    res.send({
        success: true,
        quizBank
    });
};

exports.findChapter = async(req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    res.send({
        success: true,
        chapter
    });
};

exports.updateChapter = async(req, res) => {
    let data = req.subject;
    let chapter = data.quizBank.find(function(value) {
        return value._id == req.params.idChapter
    });

    if (!chapter) {
        return res.status(404).send({
            success: false,
            message: "Not found question collection"
        })
    }
    chapter.name = req.body.data.name;

    await data.save()
        .then(() => {
            res.send({
                // _id: chapter._id,
                // name: chapter.name
                success: true,
                message: 'Update chapter successfully!'
            });
        })
        .catch((err) => {
            console.log(err.name);
            if (err.name === 'ValidationError') {
                var key = Object.keys(err.errors)[0];
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
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            success: false,
            message: "Not found chapter",
        });
    }

    var index = data.quizBank.indexOf(chapter);
    data.quizBank.splice(index, 1);
    await data.save()
        .then(() => {
            res.send({
                success: true,
                message: "Delete Successfully!"
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};

exports.pushQuestion = async(req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            success: false,
            message: "Not found chapter",
        });
    }
    var model = req.body.data.questions;
    await model.forEach(element => {
        chapter.questions.push(element);
    });
    await data.save()
        .then(() => {
            // res.send(chapter);
            res.send({
                success: true,
                message: `Add question to chapter ${chapter.name} successfully!`
            })
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};

exports.getAllQuestion = async(req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            success: false,
            message: "Not found chapter",
        });
    }

    res.send({
        success: true,
        questions: chapter.questions
    });
};

exports.getQuestionById = async(req, res) => {
    let data = req.subject;
    var chapter = data.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            success: false,
            message: "Not found chapter",
        });
    }
    var question = chapter.questions.find(value => value._id == req.params.idQuestion);

    if (!question) {
        return res.status(404).send({
            success: false,
            message: "Not found question",
        });
    }

    res.send({
        success: false,
        question
    });
};

exports.updateQuestionById = async(req, res) => {
    let subject = req.subject;
    var chapter = subject.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            success: false,
            message: "Not found chapter",
        });
    }
    var question = chapter.questions.find(value => value._id == req.params.idQuestion);

    if (!question) {
        return res.status(404).send({
            success: false,
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
            return res.send({
                success: true,
                message: 'Update question successfully!'
            });
        })
        .catch((err) => {
            return res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};

exports.deleteQuestionById = async(req, res) => {
    let subject = req.subject;
    var chapter = subject.quizBank.find(value => value._id == req.params.idChapter);
    if (!chapter) {
        return res.status(404).send({
            success: false,
            message: "Not found chapter",
        });
    }
    var question = chapter.questions.find(value => value._id == req.params.idQuestion);

    if (!question) {
        return res.status(404).send({
            success: false,
            message: "Not found question",
        });
    }

    let index = chapter.questions.indexOf(question);
    chapter.questions.splice(index, 1);

    await subject.save()
        .then(() => {
            return res.send({
                success: true,
                message: "Delete question successfully!"
            });
        })
        .catch((err) => {
            return res.status(500).send({
                success: false,
                message: err.message,
            });
        });
}