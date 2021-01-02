exports.createQuestionnaire = async(req, res) => {
    let data = req.subject;
    const model = {
        name: req.body.data.name,
    };
    let length = data.surveyBank.push(model);
    await data.save()
        .then(() => {
            res.send({
                success: true,
                questionnaire: data.surveyBank[length - 1]
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

exports.findAllQuestionnaire = async(req, res) => {
    let data = req.subject;
    let surveyBank = await Promise.all(data.surveyBank.map(value => {
        return {
            _id: value._id,
            name: value.name,
            questions: value.questions.length
        }
    }));
    res.send({
        success: true,
        surveyBank: surveyBank
    });
};

exports.findQuestionnaire = async(req, res) => {
    let data = req.subject;
    const questionnaire = data.surveyBank.find(value => value._id == req.params.idQuestionnaire);
    res.send({
        success: true,
        questionnaire
    });
};

exports.updateQuestionnaire = async(req, res) => {
    let data = req.subject;
    let questionnaire = data.surveyBank.find(function(value) {
        return value._id == req.params.idQuestionnaire
    });

    if (!questionnaire) {
        return res.status(404).send({
            success: false,
            message: "Not found questionnaire"
        })
    }
    questionnaire.name = req.body.data.name;

    await data.save()
        .then(() => {
            res.send({
                // _id: Questionnaire._id,
                // name: Questionnaire.name
                success: true,
                message: 'Update Questionnaire successfully!'
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

exports.deleteQuestionnaire = async(req, res) => {
    let data = req.subject;
    const Questionnaire = data.surveyBank.find(value => value._id == req.params.idQuestionnaire);
    if (!Questionnaire) {
        return res.status(404).send({
            success: false,
            message: "Not found Questionnaire",
        });
    }

    const index = data.surveyBank.indexOf(Questionnaire);
    data.surveyBank.splice(index, 1);
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
    var Questionnaire = data.surveyBank.find(value => value._id == req.params.idQuestionnaire);
    if (!Questionnaire) {
        return res.status(404).send({
            success: false,
            message: "Not found Questionnaire",
        });
    }
    var model = req.body.data.questions;
    await model.forEach(element => {
        Questionnaire.questions.push(element);
    });
    await data.save()
        .then(() => {
            // res.send(Questionnaire);
            res.send({
                success: true,
                message: `Add question to Questionnaire ${Questionnaire.name} successfully!`
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
    var Questionnaire = data.surveyBank.find(value => value._id == req.params.idQuestionnaire);
    if (!Questionnaire) {
        return res.status(404).send({
            success: false,
            message: "Not found Questionnaire",
        });
    }

    res.send({
        success: true,
        questions: Questionnaire.questions
    });
};

exports.getQuestionById = async(req, res) => {
    let data = req.subject;
    var Questionnaire = data.surveyBank.find(value => value._id == req.params.idQuestionnaire);
    if (!Questionnaire) {
        return res.status(404).send({
            success: false,
            message: "Not found Questionnaire",
        });
    }
    var question = Questionnaire.questions.find(value => value._id == req.params.idQuestion);

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
    var Questionnaire = subject.surveyBank.find(value => value._id == req.params.idQuestionnaire);
    if (!Questionnaire) {
        return res.status(404).send({
            success: false,
            message: "Not found Questionnaire",
        });
    }
    var question = Questionnaire.questions.find(value => value._id == req.params.idQuestion);

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
    var Questionnaire = subject.surveyBank.find(value => value._id == req.params.idQuestionnaire);
    if (!Questionnaire) {
        return res.status(404).send({
            success: false,
            message: "Not found Questionnaire",
        });
    }
    var question = Questionnaire.questions.find(value => value._id == req.params.idQuestion);

    if (!question) {
        return res.status(404).send({
            success: false,
            message: "Not found question",
        });
    }

    let index = Questionnaire.questions.indexOf(question);
    Questionnaire.questions.splice(index, 1);

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