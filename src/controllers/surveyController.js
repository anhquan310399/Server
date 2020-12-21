exports.create = (req, res) => {
    let subject = req.subject;

    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    const model = {
        name: req.body.data.name,
        description: req.body.data.description,
        questionnaire: req.body.data.questionnaire,
        expiredTime: new Date(req.body.data.expiredTime)
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

exports.find = (req, res) => {
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
    res.send({
        success: true,
        survey: {
            _id: survey._id,
            name: survey.name,
            description: survey.description,
            expiredTime: survey.expiredTime
        }
    })

}

exports.findAll = (req, res) => {
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

exports.update = (req, res) => {
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
    if (req.body.data.questionnaire) { survey.questionnaire = req.body.data.questionnaire; }

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

exports.hideOrUnhide = (req, res) => {
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

exports.delete = (req, res) => {
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

exports.replySurvey = (req, res) => {
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


}