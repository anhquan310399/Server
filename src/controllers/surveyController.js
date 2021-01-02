exports.create = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    let code = req.body.data.code;
    var questionnaire = subject.surveyBank.find(value => value._id == code);
    if (!questionnaire) {
        return res.status(404).send({
            success: false,
            message: "Not found questionnaire",
        });
    }
    const model = {
        name: req.body.data.name,
        description: req.body.data.description,
        code: code,
        expireTime: new Date(req.body.data.expireTime)
    };

    var length = timeline.surveys.push(model);
    subject.save()
        .then(() => {
            res.send({
                success: true,
                message: "Create survey successfully!",
                survey: timeline.surveys[length - 1]
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

exports.find = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    let survey;
    if (req.user.idPrivilege === 'student') {
        survey = timeline.surveys.find(value => value._id == req.params.idSurvey && value.isDeleted === false)
    } else {
        survey = timeline.surveys.find(value => value._id == req.params.idSurvey)
    }
    if (!survey) {
        return res.status(404).send({
            success: false,
            message: "Not found survey",
        });
    }
    let today = Date.now();
    let isRemain = today > survey.expireTime ? false : true;
    let timeRemain = today - survey.expireTime.getTime();
    if (req.user.idPrivilege === 'student') {
        let reply = survey.responses.find(value => value.idStudent == req.user._id);
        res.send({
            success: true,
            survey: {
                _id: survey._id,
                name: survey.name,
                description: survey.description,
                expireTime: survey.expireTime,
                isRemain: isRemain,
                timeRemain: timeRemain,
                canAttempt: reply ? false : true
            }
        })
    } else {
        res.send({
            success: true,
            survey: {
                _id: survey._id,
                name: survey.name,
                description: survey.description,
                expireTime: survey.expireTime,
                isRemain: isRemain,
                timeRemain: timeRemain,
                responses: survey.responses.length
            }
        })
    }

}

exports.findAll = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    const surveys = timeline.surveys.map(survey => {
        return {
            _id: survey._id,
            name: survey.name,
            description: survey.description
        }
    })
    res.send({
        success: true,
        surveys: surveys
    })

}

exports.update = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const survey = timeline.surveys.find(value => value._id == req.params.idSurvey)
    if (!survey) {
        return res.status(404).send({
            success: false,
            message: "Not found survey",
        });
    }
    if (req.body.data.name) { survey.name = req.body.data.name; }
    if (req.body.data.description) { survey.description = req.body.data.description; }
    if (req.body.data.expireTime) { survey.expireTime = req.body.data.expireTime; }
    if (req.body.data.code) {
        var questionnaire = subject.surveyBank.find(value => value._id == req.body.data.code);
        if (!questionnaire) {
            return res.status(404).send({
                success: false,
                message: "Not found questionnaire",
            });
        }
        survey.code = req.body.data.code;
    }

    subject.save()
        .then(() => {
            res.send({
                success: true,
                message: 'Update survey successfully!'
            })

        }).catch((err) => {
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

}

exports.hideOrUnhide = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const survey = timeline.surveys.find(value => value._id == req.params.idSurvey)
    if (!survey) {
        return res.status(404).send({
            success: false,
            message: "Not found survey",
        });
    }

    survey.isDeleted = !survey.isDeleted;

    subject.save()
        .then(() => {
            let message;
            if (survey.isDeleted) {
                message = `Hide survey ${survey.name} successfully!`
            } else {
                message = `Unhide survey ${survey.name} successfully!`
            }
            res.send({
                success: true,
                message: message
            })

        }).catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });

        });
}

exports.delete = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const survey = timeline.surveys.find(value => value._id == req.params.idSurvey)
    if (!survey) {
        return res.status(404).send({
            success: false,
            message: "Not found survey",
        });
    }

    let index = timeline.surveys.indexOf(survey);
    timeline.surveys.splice(index, 1);

    subject.save()
        .then(() => {
            res.send({
                success: true,
                message: "Delete survey successfully!"
            })

        }).catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
}

exports.attemptSurvey = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const survey = timeline.surveys.find(value => value._id == req.params.idSurvey)
    if (!survey) {
        return res.status(404).send({
            success: false,
            message: "Not found survey",
        });
    }

    let reply = survey.responses.find(value => value.idStudent == req.idStudent);
    if (reply) {
        return res.status(409).send({
            success: false,
            message: `You have already reply survey ${survey.name}`
        });
    }
    const questionnaire = subject.surveyBank.find(value => value._id == survey.code);

    res.send({
        success: true,
        survey: {
            _id: survey._id,
            name: survey.name
        },
        questionnaire: questionnaire
    })
}

exports.replySurvey = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const survey = timeline.surveys.find(value => value._id == req.params.idSurvey)
    if (!survey) {
        return res.status(404).send({
            success: false,
            message: "Not found survey",
        });
    }

    let reply = survey.responses.find(value => value.idStudent == req.idStudent);
    if (reply) {
        return res.status(409).send({
            success: false,
            message: `You have already reply survey ${survey.name}`
        });
    }

    let data = req.body.data;

    reply = {
        idStudent: req.idStudent,
        answerSheet: data
    }
    survey.responses.push(reply);

    subject.save()
        .then(() => {
            res.send({
                success: true,
                message: `Reply survey ${survey.name} successfully!`,
            });
        }).catch((err) => {
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
}

exports.viewResponse = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const survey = timeline.surveys.find(value => value._id == req.params.idSurvey)
    if (!survey) {
        return res.status(404).send({
            success: false,
            message: "Not found survey",
        });
    }

    const reply = survey.responses.find(value => value.idStudent == req.idStudent);
    if (!reply) {
        return res.status(404).send({
            success: false,
            message: `You have not already reply survey ${survey.name}`
        });
    }
    const questionnaire = subject.surveyBank.find(value => value._id == survey.code).questions;

    res.send({
        success: true,
        survey: {
            _id: survey._id,
            name: survey.name
        },
        questionnaire: questionnaire,
        response: reply
    })
}

exports.viewAllResponse = async(req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const survey = timeline.surveys.find(value => value._id == req.params.idSurvey)
    if (!survey) {
        return res.status(404).send({
            success: false,
            message: "Not found survey",
        });
    }

    const questionnaire = subject.surveyBank.find(value => value._id == survey.code).questions;


    let result = await Promise.all(questionnaire.map(async(question) => {
        let answer;
        if (question.typeQuestion === 'choice') {
            answer = await Promise.all(question.answer.map(async(answer) => {
                let count = 0;
                survey.responses.forEach(reply => {
                    reply.answerSheet.forEach(answerSheet => {
                        if (question._id != answerSheet.idQuestion) {
                            return;
                        }
                        if (answerSheet.answer == answer._id) {
                            count++;
                        }
                    })
                });
                let percent = ((count / survey.responses.length) * 100).toFixed(0) + "%";
                return {
                    _id: answer._id,
                    content: answer.content,
                    total: count,
                    percent: percent
                }
            }))
        } else if (question.typeQuestion === 'multiple') {
            answer = await Promise.all(question.answer.map(async(answer) => {
                let count = 0;
                survey.responses.forEach(reply => {
                    reply.answerSheet.forEach(answerSheet => {
                        if (question._id != answerSheet.idQuestion) {
                            return;
                        }
                        answerSheet.answer.forEach(idAnswer => {
                            if (idAnswer == answer._id) {
                                count++;
                            }
                        });
                    })
                });
                let percent = ((count / survey.responses.length) * 100).toFixed(0) + "%";
                return {
                    _id: answer._id,
                    content: answer.content,
                    total: count,
                    percent: percent
                }
            }))
        } else {
            answer = [];
            survey.responses.forEach(reply => {
                reply.answerSheet.forEach(answerSheet => {
                    if (question._id != answerSheet.idQuestion) {
                        return;
                    }
                    answer = answer.concat(answerSheet.answer);
                })
            })
        }

        return {
            question: question.question,
            typeQuestion: question.typeQuestion,
            answer: answer
        };
    }))


    res.send({
        success: true,
        survey: {
            _id: survey._id,
            name: survey.name
        },
        totalResponses: survey.responses.length,
        questionnaire: result
    });
}