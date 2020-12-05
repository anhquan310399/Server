const _ = require('lodash');
const moment = require('moment');

exports.create = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    var code = req.body.setting.code;

    var chapter = data.quizBank.find(value => value._id == code);
    if (!chapter) {
        return res.status(404).send({
            message: "Not found quiz bank",
        });
    }

    const model = {
        name: req.body.name,
        content: req.body.content,
        startTime: new Date(req.body.startTime),
        expireTime: new Date(req.body.expireTime),
        setting: req.body.setting
    };

    var length = timeline.exams.push(model);

    data.save()
        .then(() => {
            res.send(timeline.exams[length - 1]);
        })
        .catch((err) => {
            const key = Object.keys(err.errors)[0];
            res.status(400).send({
                message: err.errors[key].message,
            });
        });
};

exports.find = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const exam = timeline.exams.find(value => value._id == req.params.idExam);
    if (!exam) {
        return res.status(404).send({
            message: "Not found exam",
        });
    }

    const today = Date.now();
    const isRemain = (today <= exam.expireTime);
    const timingRemain = moment(exam.expireTime).from(moment(today));


    if (req.user.idPrivilege === 'student') {
        let submission = exam.submissions.find(value => value.studentId == req.user._id);
        if (submission) {
            res.send({
                _id: exam._id,
                name: exam.name,
                content: exam.content,
                startTime: exam.startTime,
                expireTime: exam.expireTime,
                setting: exam.setting,
                isRemain: isRemain,
                timingRemain: timingRemain,
                submission: submission
            })
        } else {
            res.send({
                _id: exam._id,
                name: exam.name,
                content: exam.content,
                startTime: exam.startTime,
                expireTime: exam.expireTime,
                setting: exam.setting,
                isRemain: isRemain,
                timingRemain: timingRemain,
                submission: null
            });
        }
    } else {
        res.send({
            _id: exam._id,
            name: exam.name,
            content: exam.content,
            startTime: exam.expireTime,
            expireTime: exam.expireTime,
            setting: exam.setting,
            isRemain: isRemain,
            timingRemain: timingRemain,
            submissions: exam.submissions
        });
    }
};

exports.findAll = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    res.send(timeline.exams.map((value) => {
        return {
            _id: value._id,
            name: value.name,
            content: value.content
        }
    }));
};

exports.update = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    const exam = timeline.exams.find(function(value, index, arr) {
        if (value._id == req.params.idExam) {
            if (req.body.data.name) { arr[index].name = req.body.data.name };
            if (req.body.data.content) { arr[index].content = req.body.data.content };
            if (req.body.data.startTime) { arr[index].startTime = new Date(req.body.data.startTime) };
            if (req.body.data.expireTime) { arr[index].expireTime = new Date(req.body.data.expireTime) };
            if (req.body.data.setting) { arr[index].setting = req.body.data.setting };
            return true;
        } else {
            return false;
        }
    });

    data.save()
        .then(() => {
            res.send(exam);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.delete = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    const exam = timeline.exams.find(value => value._id == req.params.idExam);
    const indexExam = timeline.exams.indexOf(exam);


    timeline.exams.splice(indexExam, 1);
    data.save()
        .then(() => {
            res.send("Delete Exam Successfully!");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

//Kiểm tra đã tham gia làm chưa
//Nếu đã tham gia kiểm tra hết thời gian làm của lần này chưa
//Nếu quá thời gian kiểm tra còn lượt tham gia hay không

exports.doExam = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline"
        });
    }
    const exam = timeline.exams.find(value => value._id == req.params.idExam);

    if (!exam) {
        res.status(404).send({
            message: "Not found exam!"
        });
    }

    const today = Date.now();
    if (today >= exam.startTime && today < exam.expireTime) {
        const setting = exam.setting;
        let submission = exam.submissions.find(value => value.studentId === req.idStudent);
        let attempt = 0;
        console.log(submission);
        if (submission) {
            attempt = submission.length
            if (!submission.isSubmitted) {
                let totalTime = ((today - submission.startTime) / (1000)).toFixed(0);
                console.log(totalTime);
                if (totalTime < exam.setting.timeToDo) {
                    let questions = submission.answers.map(value => {
                        let quizBank = subject.quizBank.find(bank => {
                            return bank._id == setting.code;
                        });
                        console.log(quizBank);
                        let question = quizBank.questions.find(ques => {
                            return ques._id == value.questionId;
                        })
                        return {
                            _id: question._id,
                            question: question.question,
                            typeQuestion: question.typeQuestion,
                            answers: question.answers.map(value => { return { _id: value.id, answer: value.answer } })
                        }
                    })
                    return res.send({
                        _id: exam._id,
                        name: exam.name,
                        timeToDo: setting.timeToDo,
                        questions: questions
                    });
                }
            }
        }

        if (attempt < setting.attemptCount) {
            var chapter = subject.quizBank.find(value => value._id == setting.code);
            if (!chapter) {
                return res.status(404).send({
                    message: "Not found question",
                });
            }
            const questions = _.sampleSize(chapter.questions, setting.questionCount)
                .map(value => {
                    return {
                        _id: value._id,
                        question: value.question,
                        typeQuestion: value.typeQuestion,
                        answers: value.answers.map(value => { return { _id: value.id, answer: value.answer } })
                    }
                });

            var submit = {
                studentId: req.idStudent,
                answers: questions.map(value => {
                    return { questionId: value._id }
                }),

            }
            exam.submissions.push(submit);

            subject.save()
                .then((data) => {
                    res.send({
                        _id: exam._id,
                        name: exam.name,
                        timeToDo: setting.timeToDo,
                        questions: questions
                    });
                }).
            catch(err => {
                res.status(500).send({ message: err.message });
            })
        } else {
            res.status(403).send({
                message: "Đã vượt quá số lần tham gia!"
            })
        }
    } else {
        if (today < exam.startTime) {
            res.status(403).send({
                message: "Chưa đến thời gian làm bài"
            });
        } else {
            res.status(403).send({
                message: "Đã quá thời hạn làm bài!"
            });
        }
    }

}