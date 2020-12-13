const { response } = require('express');
const _ = require('lodash');
const moment = require('moment');
const User = require('../models/user');

exports.create = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    var code = req.body.data.setting.code;

    var chapter = subject.quizBank.find(value => value._id == code);
    if (!chapter) {
        return res.status(404).send({
            success: false,
            message: "Not found quiz bank",
        });
    }

    let setting = req.body.data.setting;
    console.log(setting);

    const model = {
        name: req.body.data.name,
        content: req.body.data.content,
        startTime: new Date(req.body.data.startTime),
        expireTime: new Date(req.body.data.expireTime),
        setting: {
            questionCount: setting.questionCount,
            timeToDo: setting.timeToDo,
            code: setting.code,
            attemptCount: setting.attemptCount
        }
    };

    var length = timeline.exams.push(model);
    subject.save()
        .then(() => {
            let exam = timeline.exams[length - 1];
            const today = Date.now();
            const isRemain = (today <= exam.expireTime);
            const timingRemain = moment(exam.expireTime).from(moment(today));
            res.send({
                _id: exam._id,
                name: exam.name,
                content: exam.content,
                startTime: exam.expireTime,
                expireTime: exam.expireTime,
                setting: exam.setting,
                isRemain: isRemain,
                timingRemain: timingRemain
            });
        })
        .catch((err) => {
            const key = Object.keys(err.errors)[0];
            res.status(400).send({
                success: false,
                message: err.errors[key].message,
            });
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

    const exam = timeline.exams.find(value => value._id == req.params.idExam);
    if (!exam) {
        return res.status(404).send({
            success: false,
            message: "Not found exam",
        });
    }

    const today = Date.now();
    const isRemain = (today <= exam.expireTime);
    const timingRemain = moment(exam.expireTime).from(moment(today));


    if (req.user.idPrivilege === 'student') {
        let submissions = exam.submissions.filter(value => value.idStudent == req.user._id);
        console.log(submissions);
        let isContinue = false;
        submissions = await Promise.all(submissions.map(async(submission, index) => {
            if (index = submissions.length) {
                if (today >= exam.startTime && today < exam.expireTime) {
                    if (!submission.isSubmitted) {
                        let totalTime = ((today - submission.startTime) / (1000)).toFixed(0);
                        console.log(totalTime);
                        if (totalTime <= setting.timeToDo) {
                            isContinue = true;
                        }
                    }
                }
            }

            return {
                _id: submission._id,
                student: {
                    _id: req.user._id,
                    code: req.user.code,
                    firstName: req.user.firstName,
                    surName: req.user.surName,
                    urlAvatar: req.user.urlAvatar,
                },
                grade: submission.isSubmitted ? submission.grade : null,
                isSubmitted: submission.isSubmitted,
                isContinue: isContinue
            }
        }));
        let isAttempt = false;
        let attemptAvailable = exam.setting.attemptCount - submissions.length;
        if (!isContinue && attemptAvailable > 0) {
            if (today >= exam.startTime && today < exam.expireTime) {
                isAttempt = true;
            }
        }

        res.send({
            _id: exam._id,
            name: exam.name,
            content: exam.content,
            startTime: exam.startTime,
            expireTime: exam.expireTime,
            setting: exam.setting,
            isRemain: isRemain,
            timingRemain: timingRemain,
            isAttempt: isAttempt,
            attemptAvailable: attemptAvailable,
            submissions: submissions
        })
    } else {
        //Lấy bài kiểm tra cao nhất của từng sinh viên
        let exists = [];
        let submissions = await exam.submissions.reduce(async function(prePromise, submission) {
            let result = await prePromise;

            let exist = await exists.find(value => value.idStudent == submission.idStudent);
            if (exist) {
                let existSubmission = result[exist.index];
                result[exist.index].grade = existSubmission.grade >= submission.grade ? existSubmission.grade : submission.grade;
                result[exist.index].attemptCount++;
                return result;
            } else {
                // var student = await User.findById(submission.idStudent, 'code firstName surName urlAvatar')
                //     .then(value => {
                //         return value
                //     });

                exists = exists.concat({
                    idStudent: submission.idStudent,
                    grade: submission.grade,
                    index: result.length
                })
                return result.concat({
                    _id: submission._id,
                    // student: student,
                    idStudent: submission.idStudent,
                    grade: submission.grade,
                    attemptCount: 1
                })
            }
        }, []);



        let data = await Promise.all(subject.studentIds.map(
            async(value) => {

                let student = await User.findOne({ code: value }, 'code firstName surName urlAvatar')
                    .then(value => { return value });
                let submission = await submissions.find(value => value.idStudent == student._id);
                if (submission) {
                    return {
                        _id: submission._id,
                        student: student,
                        grade: submission.grade,
                        attemptCount: submission.attemptCount
                    }
                } else if (isRemain) {
                    return {
                        _id: null,
                        student: student,
                        grade: null,
                        attemptCount: 0
                    }
                } else {
                    return {
                        _id: null,
                        student: student,
                        grade: 0,
                        attemptCount: 0
                    }
                }
            }
        ));

        res.send({
            _id: exam._id,
            name: exam.name,
            content: exam.content,
            startTime: exam.expireTime,
            expireTime: exam.expireTime,
            setting: exam.setting,
            isRemain: isRemain,
            timingRemain: timingRemain,
            submissions: data
        });
    }
};

exports.findAll = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
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
            success: false,
            message: "Not found timeline",
        });
    }
    const exam = timeline.exams.find(value => value._id == req.params.idExam);

    if (!exam) {
        return res.status(404).send({
            success: false,
            message: "Not found exam",
        });
    }
    if (req.body.data.name) { exam.name = req.body.data.name };
    if (req.body.data.content) { exam.content = req.body.data.content };
    if (req.body.data.startTime) { exam.startTime = new Date(req.body.data.startTime) };
    if (req.body.data.expireTime) { exam.expireTime = new Date(req.body.data.expireTime) };
    if (req.body.data.setting) {
        let setting = req.body.data.setting;
        exam.setting = {
            questionCount: setting.questionCount,
            timeToDo: setting.timeToDo,
            code: setting.code,
            attemptCount: setting.attemptCount
        }
    };



    data.save()
        .then((data) => {
            const today = Date.now();
            const isRemain = (today <= exam.expireTime);
            const timingRemain = moment(exam.expireTime).from(moment(today));
            res.send({
                _id: exam._id,
                name: exam.name,
                content: exam.content,
                startTime: exam.expireTime,
                expireTime: exam.expireTime,
                setting: exam.setting,
                isRemain: isRemain,
                timingRemain: timingRemain
            });
        })
        .catch((err) => {

            console.log(err);
            res.status(500).send({
                success: false,
                message: err.message,
            })

            // const key = Object.keys(err.errors)[0];
            // res.status(400).send({
            //     success: false,
            //     message: err.errors[key].message,
            // });
        });
};

exports.delete = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    const exam = timeline.exams.find(value => value._id == req.params.idExam);
    if (!exam) {
        return res.status(404).send({
            success: false,
            message: "Not found exam",
        });
    }

    const indexExam = timeline.exams.indexOf(exam);


    timeline.exams.splice(indexExam, 1);
    data.save()
        .then(() => {
            res.send({
                success: true,
                message: "Delete Exam Successfully!"
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};

exports.doExam = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        });
    }
    const exam = timeline.exams.find(value => value._id == req.params.idExam);

    if (!exam) {
        res.status(404).send({
            success: false,
            message: "Not found exam!"
        });
    }

    const today = Date.now();
    if (today >= exam.startTime && today < exam.expireTime) {
        const setting = exam.setting;
        let submissions = exam.submissions.filter(value => value.idStudent == req.idStudent);
        let attempt = 0;
        if (submissions && submissions.length > 0) {
            console.log(submissions);
            attempt = submissions.length;
            let submission = submissions[attempt - 1];
            if (!submission.isSubmitted) {
                let totalTime = ((today - submission.startTime) / (1000)).toFixed(0);
                console.log(`Thời gian đã làm quiz: ${totalTime}`);
                if (totalTime < setting.timeToDo) {
                    let questions = submission.answers.map(value => {
                        let quizBank = subject.quizBank.find(bank => {
                            return bank._id == setting.code;
                        });
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
                    success: false,
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
                idStudent: req.idStudent,
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
                }).catch(err => {
                    res.status(500).send({
                        success: false,
                        message: err.message
                    });
                })
        } else {
            res.status(403).send({
                success: false,
                message: "Đã vượt quá số lần tham gia!"
            })
        }
    } else {
        if (today < exam.startTime) {
            res.status(403).send({
                success: false,
                message: "Chưa đến thời gian làm bài"
            });
        } else {
            res.status(403).send({
                success: false,
                message: "Đã quá thời hạn làm bài!"
            });
        }
    }

}

exports.submitExam = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        });
    }
    const exam = timeline.exams.find(value => value._id == req.params.idExam);

    if (!exam) {
        res.status(404).send({
            success: false,
            message: "Not found exam!"
        });
    }

    const today = Date.now();
    if (today >= exam.startTime && today < exam.expireTime) {
        const setting = exam.setting;
        let submissions = exam.submissions.filter(value => value.idStudent == req.idStudent);
        let attempt = 0;
        if (submissions && submissions.length > 0) {
            attempt = submissions.length
            let submission = submissions[attempt - 1];
            if (!submission.isSubmitted) {
                let totalTime = ((today - submission.startTime) / (1000)).toFixed(0);
                console.log(totalTime);
                if (totalTime <= setting.timeToDo) {
                    let data = req.body.data;
                    submission.answers = submission.answers.map(value => {
                        let answer = data.find(answer => {
                            return answer.questionId == value.questionId;
                        });
                        let answerId = answer ? answer.answerId : '';
                        return {
                            questionId: value.questionId,
                            answerId: answerId
                        }

                    });
                    submission.isSubmitted = true;

                    subject.save()
                        .then(() => {
                            res.send({
                                success: true,
                                message: "Nộp bài thành công"
                            });
                        })
                        .catch(err => {
                            res.status(500).send({
                                success: false,
                                message: err.message
                            });
                        })
                } else {
                    res.status(403).send({
                        success: false,
                        message: "Đã hết thời gian nộp bài!"
                    })
                }
            } else {
                res.status(403).send({
                    success: false,
                    message: "Đã nộp bài rồi!"
                })
            }

        } else {
            res.status(403).send({
                success: false,
                message: "Chưa có thông tin làm bài vui lòng làm bài trước!"
            })
        }
    } else {
        if (today < exam.startTime) {
            res.status(403).send({
                success: false,
                message: "Chưa đến thời gian làm bài"
            });
        } else {
            res.status(403).send({
                success: false,
                message: "Đã quá thời hạn làm bài!"
            });
        }
    }
}