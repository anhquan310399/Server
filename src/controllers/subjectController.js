const db = require("../models/subject");
const userDb = require('../models/user');
const _ = require('lodash');
const isToday = require('../common/isToday');
const moment = require('moment');
exports.create = async (req, res) => {
    // Validate request
    const data = new db({
        name: req.body.name,
        idLecture: req.body.idLecture,
        studentIds: req.body.studentIds,
        timelines: req.body.timelines,
        quizBank: req.body.quizBank,
        surveyBank: req.body.surveyBank
    });

    await data.save()
        .then(async (data) => {

            var teacher = await userDb.findOne({ code: data.idLecture }, 'code firstName surName urlAvatar')
                .then(value => {
                    return value
                });
            res.send({
                success: true,
                subject: {
                    _id: data._id,
                    name: data.name,
                    lecture: teacher,
                    studentCount: data.studentIds.length,
                    isDeleted: data.isDeleted
                },
                message: `Create new subject ${data.name} successfully!`
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

exports.findAll = async (req, res) => {
    var idPrivilege = req.idPrivilege;
    if (idPrivilege === 'teacher') {
        db.find({ idLecture: req.code, isDeleted: false })
            .then((data) => {
                var info = data.map(function (value) {
                    return { _id: value._id, name: value.name };
                });
                res.send({
                    success: true,
                    allSubject: info
                });
            })
            .catch((err) => {
                res.status(500).send({
                    success: false,
                    message: err.message || "Some error occurred while listing subject.",
                });
            });
    } else if (idPrivilege === 'student') {
        db.find({ 'studentIds': req.code, isDeleted: false })
            .then(async function (data) {
                var info = await Promise.all(data.map(async function (value) {
                    var teacher = await userDb.findOne({ code: value.idLecture }, 'code firstName surName urlAvatar')
                        .then(value => {
                            return value
                        });
                    return { _id: value._id, name: value.name, lecture: teacher };
                }));
                res.send({
                    success: true,
                    allSubject: info
                });
            })
            .catch((err) => {
                res.status(500).send({
                    success: false,
                    message: err.message || "Some error occurred while listing subject.",
                });
            });
    } else if (idPrivilege === 'admin') {
        db.find()
            .then(async (data) => {
                var info = await Promise.all(data.map(async function (value) {
                    var teacher = await userDb.findOne({ code: value.idLecture }, 'code firstName surName urlAvatar')
                        .then(value => {
                            return value
                        });
                    return { _id: value._id, name: value.name, lecture: teacher, studentCount: value.studentIds.length, studentIds: value.studentIds, isDeleted: value.isDeleted };
                }));
                res.send({
                    success: true,
                    allSubject: info
                });
            })
            .catch((err) => {
                res.status(500).send({
                    success: false,
                    message: err.message || "Some error occurred while listing subject.",
                });
            });
    }

};

exports.find = async (req, res) => {
    let subject = req.subject;
    let timelines = req.subject.timelines;
    console.log(req.user.idPrivilege);
    let teacher = userDb.findOne({ code: subject.idLecture }, 'code firstName surName urlAvatar')
        .then(value => { return value });

    if (req.user.idPrivilege === 'student') {
        timelines = await timelines.filter((value) => {
            if (value.isDeleted === false) {
                return true
            } else {
                return false;
            }
        });
        timelines = _.sortBy(await Promise.all(timelines.map(async (value) => {
            let forums = value.forums.reduce((preForums, currentForum) => {
                if (currentForum.isDeleted) {
                    return preForums;
                }
                let forum = {
                    _id: currentForum.id,
                    name: currentForum.name,
                    description: currentForum.description,
                    time: currentForum.createdAt,
                    isNew: isToday(currentForum.updatedAt)
                }
                return (preForums.concat(forum));
            }, []);
            let exams = value.exams.reduce((preExams, currentExam) => {
                if (currentExam.isDeleted) {
                    return preExams;
                }

                let exam = {
                    _id: currentExam._id,
                    name: currentExam.name,
                    description: currentExam.description,
                    time: currentExam.createdAt,
                    isNew: isToday(currentExam.createdAt)
                }
                return (preExams.concat(exam));
            }, []);
            let information = value.information.map((info) => {
                return {
                    _id: info._id,
                    name: info.name,
                    content: info.content,
                    time: info.createdAt,
                    isNew: isToday(info.updatedAt)
                }
            });
            let assignments = value.assignments.reduce((preAssignments, currentAssignment) => {
                if (currentAssignment.isDeleted) {
                    return preAssignments;
                }

                let assignment = {
                    _id: currentAssignment._id,
                    name: currentAssignment.name,
                    description: currentAssignment.description,
                    time: currentAssignment.createdAt,
                    isNew: isToday(currentAssignment.createdAt)
                }
                return (preAssignments.concat(assignment));
            }, []);
            let surveys = value.surveys.reduce((preSurveys, currentSurvey) => {
                if (currentSurvey.isDeleted) {
                    return preSurveys;
                }

                let survey = {
                    _id: currentSurvey._id,
                    name: currentSurvey.name,
                    description: currentSurvey.description,
                    time: currentSurvey.createdAt,
                    isNew: isToday(currentSurvey.createdAt)
                }
                return (preSurveys.concat(survey));
            }, []);

            return {
                _id: value._id,
                name: value.name,
                description: value.description,
                surveys: surveys,
                forums: forums,
                exams: exams,
                information: information,
                assignments: assignments,
                files: value.files,
                index: value.index
            };
        })), ['index']);
    } else {
        timelines = _.sortBy(await Promise.all(timelines.map(async (value) => {
            let forums = value.forums.map((forum) => {
                return {
                    _id: forum.id,
                    name: forum.name,
                    description: forum.description,
                    time: forum.createdAt,
                    isNew: isToday(forum.updatedAt),
                    isDeleted: forum.isDeleted
                }
            });
            let exams = value.exams.map((exam) => {
                return {
                    _id: exam._id,
                    name: exam.name,
                    description: exam.description,
                    time: exam.createdAt,
                    isNew: isToday(exam.createdAt),
                    isDeleted: exam.isDeleted
                }
            });
            let information = value.information.map((info) => {
                return {
                    _id: info._id,
                    name: info.name,
                    content: info.content,
                    time: info.createdAt,
                    isNew: isToday(info.updatedAt)
                }
            });
            let assignments = value.assignments.map((assign) => {
                return {
                    _id: assign._id,
                    name: assign.name,
                    description: assign.description,
                    time: assign.createdAt,
                    isNew: isToday(assign.createdAt),
                    isDeleted: assign.isDeleted
                }
            });
            let surveys = value.surveys.map((survey) => {
                return {
                    _id: survey._id,
                    name: survey.name,
                    description: survey.description,
                    time: survey.createdAt,
                    isNew: isToday(survey.createdAt),
                    isDeleted: survey.isDeleted
                }
            });

            return {
                _id: value._id,
                name: value.name,
                description: value.description,
                surveys: surveys,
                forums: forums,
                exams: exams,
                information: information,
                assignments: assignments,
                files: value.files,
                index: value.index,
                isDeleted: value.isDeleted
            };

        })), ['index']);
    }
    let result = {
        _id: subject._id,
        name: subject.name,
        lecture: await teacher,
        timelines: timelines
    };
    res.send({
        success: true,
        subject: result
    });
};

exports.findByAdmin = async (req, res) => {
    db.findById(req.params.idSubject)
        .then(async (subject) => {
            if (!subject) {
                return res.status(404).send({
                    success: false,
                    message: "Not found subject",
                });
            }

            var teacher = await userDb.findOne({ code: subject.idLecture }, 'code firstName surName urlAvatar')
                .then(value => {
                    return value
                });
            res.send({
                success: true,
                subject: {
                    _id: subject._id,
                    name: subject.name,
                    lecture: teacher,
                    studentCount: subject.studentIds.length,
                    isDeleted: subject.isDeleted
                }
            });

        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
}

exports.update = async (req, res) => {
    if (!req.body || !(req.body.name && req.body.idLecture)) {
        return res.status(400).send({
            success: false,
            message: "Lack of information",
        });
    };
    let subject = await db.findById(req.params.idSubject)
        .then((data) => { return data });
    if (!subject) {
        return res.status(404).send({
            success: false,
            message: "Not found Subject",
        });
    }
    subject.name = req.body.name || subject.name;
    subject.idLecture = req.body.idLecture || subject.idLecture;
    subject.studentIds = req.body.studentIds || subject.studentIds;
    subject.timelines = req.body.timelines || subject.timelines;
    subject.surveyBank = req.body.surveyBank || subject.surveyBank;
    subject.quizBank = req.body.quizBank || subject.quizBank;

    subject.save()
        .then(() => {
            res.send({
                success: true,
                message: "Update Subject Successfully"
            });
        })
        .catch((err) => {
            console.log("Update subject: " + err.message);
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

exports.importSubject = async (req, res) => {
    let subject = req.subject;

    if (req.body.timelines) {
        if (subject.timelines.length === 0) {
            subject.timelines = req.body.timelines;
        } else {
            return res.status(400).send({
                success: false,
                message: 'Đã có dữ liệu các tuần không thể import!',
            });
        }
    }
    if (req.body.studentIds) {
        subject.studentIds = subject.studentIds.concat(req.body.studentIds);
        subject.studentIds = subject.studentIds.filter((a, b) => subject.studentIds.indexOf(a) === b)
    }
    if (req.body.surveyBank) {
        subject.surveyBank = subject.surveyBank.concat(req.body.surveyBank);
    }
    if (req.body.quizBank) {
        subject.quizBank = subject.quizBank.concat(req.body.quizBank);
    }

    subject.save()
        .then(async () => {
            let timelines = subject.timelines;
            timelines = _.sortBy(await Promise.all(timelines.map(async (value) => {
                let forums = value.forums.map((forum) => {
                    return {
                        _id: forum.id,
                        name: forum.name,
                        description: forum.description,
                        time: forum.createdAt,
                        isNew: isToday(forum.updatedAt),
                        isDeleted: forum.isDeleted
                    }
                });
                let exams = value.exams.map((exam) => {
                    return {
                        _id: exam._id,
                        name: exam.name,
                        description: exam.description,
                        time: exam.createdAt,
                        isNew: isToday(exam.createdAt),
                        isDeleted: exam.isDeleted
                    }
                });
                let information = value.information.map((info) => {
                    return {
                        _id: info._id,
                        name: info.name,
                        content: info.content,
                        time: info.createdAt,
                        isNew: isToday(info.updatedAt)
                    }
                });
                let assignments = value.assignments.map((assign) => {
                    return {
                        _id: assign._id,
                        name: assign.name,
                        description: assign.description,
                        time: assign.createdAt,
                        isNew: isToday(assign.createdAt),
                        isDeleted: assign.isDeleted
                    }
                });
                let surveys = value.surveys.map((survey) => {
                    return {
                        _id: survey._id,
                        name: survey.name,
                        description: survey.description,
                        time: survey.createdAt,
                        isNew: isToday(survey.createdAt),
                        isDeleted: survey.isDeleted
                    }
                });

                return {
                    _id: value._id,
                    name: value.name,
                    description: value.description,
                    surveys: surveys,
                    forums: forums,
                    exams: exams,
                    information: information,
                    assignments: assignments,
                    files: value.files,
                    index: value.index,
                    isDeleted: value.isDeleted
                };

            })), ['index']);

            const surveyBank = await Promise.all(subject.surveyBank.map(value => {
                return {
                    _id: value._id,
                    name: value.name,
                    questions: value.questions.length
                }
            }));
            let quizBank = await Promise.all(subject.quizBank.map(value => {
                return {
                    _id: value._id,
                    name: value.name,
                    questions: value.questions.length
                }
            }));
            res.send({
                success: true,
                message: `Import data to subject ${subject.name} successfully!`,
                timelines: timelines,
                surveyBank: surveyBank,
                quizBank: quizBank
            });
        })
        .catch((err) => {
            console.log("Update subject: " + err.message);
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

exports.delete = async (req, res) => {
    await db.findByIdAndDelete(
        req.params.idSubject
    )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Not found Subject",
                });
            }
            res.send({
                success: true,
                message: `Delete Subject ${data.name} Successfully`
            });
        })
        .catch((err) => {
            console.log("Delete subject" + err.message);
            return res.status(500).send({
                success: false,
                message: err.message
            });
        });
};

exports.hideOrUnhide = (req, res) => {
    db.findById(req.params.idSubject)
        .then((subject) => {
            if (!subject) {
                return res.status(404).send({
                    success: false,
                    message: "Not found subject",
                });
            }
            subject.isDeleted = !subject.isDeleted;
            subject.save()
                .then(data => {
                    let message;
                    if (data.isDeleted) {
                        message = `Lock subject: ${data.name} successfully!`;
                    } else {
                        message = `Unlock subject : ${data.name} successfully!`;
                    }
                    res.send({
                        success: true,
                        message: message,
                    });
                })

        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};


exports.addAllStudents = (req, res) => {
    // Validate request
    db.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Not found subject",
                });
            }
            var list = data.studentIds.concat(req.body).sort();
            list = list.filter((a, b) => list.indexOf(a) === b);
            data.studentIds = list;
            data.save()
                .then((data) => {
                    // res.send(data);
                    res.send({
                        success: true,
                        message: "Add Student Successfully!"
                    })
                })
                .catch((err) => {
                    console.log("Add student" + err.message);
                    res.status(500).send({
                        success: false,
                        message: "Add student failure"
                    });
                });
        })
        .catch((err) => {
            return res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};

exports.addStudent = (req, res) => {
    // Validate request
    let subject = req.subject;

    let idStudent = subject.studentIds.find(value => { return value === req.body.idStudent });
    if (idStudent) {
        return res.send({
            success: false,
            message: 'This student has already in subject'
        });
    }

    userDb.findOne({ code: req.body.idStudent, idPrivilege: 'student' }, 'code firstName surName urlAvatar')
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "Not found student with id: " + req.body.idStudent
                });
            }
            subject.studentIds.push(req.body.idStudent);
            subject.save()
                .then((data) => {
                    // res.send(data);
                    res.send({
                        success: true,
                        message: "Add Student Successfully!",
                        student: user
                    });
                })
                .catch((err) => {
                    console.log("Add student" + err.message);
                    res.status(500).send({
                        success: false,
                        message: "Add student failure"
                    });
                });
        });
};

exports.removeStudent = (req, res) => {
    // Validate request
    let subject = req.subject;

    let index = subject.studentIds.indexOf(req.body.idStudent);
    if (index === -1) {
        return res.send({
            success: false,
            message: 'Not found this student with id: ' + req.body.idStudent
        });
    }
    subject.studentIds.splice(index, 1);
    subject.save()
        .then((data) => {
            // res.send(data);
            res.send({
                success: true,
                message: "Remove Student Successfully!"
            });
        })
        .catch((err) => {
            console.log("Remove student" + err.message);
            res.status(500).send({
                success: false,
                message: "Remove student failure"
            });
        });
};

exports.adjustOrderOfTimeline = async (req, res) => {
    const adjust = req.body;
    const subject = req.subject;
    await adjust.forEach(element => {
        var timeline = subject.timelines.find(x => x._id == element._id);
        console.log(timeline);
        timeline.index = element.index;
        timeline.name = element.name;
    });
    await subject.save()
        .then(async () => {
            let timelines = _.sortBy(await Promise.all(subject.timelines.map(async (value) => {
                let forums = value.forums.map((forum) => {
                    return {
                        _id: forum.id,
                        name: forum.name,
                        description: forum.description,
                        time: forum.createdAt,
                        isNew: isToday(forum.updatedAt),
                        isDeleted: forum.isDeleted
                    }
                });
                let exams = value.exams.map((exam) => {
                    return {
                        _id: exam._id,
                        name: exam.name,
                        description: exam.description,
                        time: exam.createdAt,
                        isNew: isToday(exam.createdAt),
                        isDeleted: exam.isDeleted
                    }
                });
                let information = value.information.map((info) => {
                    return {
                        _id: info._id,
                        name: info.name,
                        content: info.content,
                        time: info.createdAt,
                        isNew: isToday(info.updatedAt)
                    }
                });
                let assignments = value.assignments.map((assign) => {
                    return {
                        _id: assign._id,
                        name: assign.name,
                        description: assign.description,
                        time: assign.createdAt,
                        isNew: isToday(assign.createdAt),
                        isDeleted: assign.isDeleted
                    }
                });
                let surveys = value.surveys.map((survey) => {
                    return {
                        _id: survey._id,
                        name: survey.name,
                        description: survey.description,
                        time: survey.createdAt,
                        isNew: isToday(survey.createdAt),
                        isDeleted: survey.isDeleted
                    }
                });

                return { _id: value._id, name: value.name, description: value.description, surveys: surveys, forums: forums, exams: exams, information: information, assignments: assignments, files: value.files, index: value.index, isDeleted: value.isDeleted };

            })), ['index']);
            res.send({
                success: true,
                message: 'Adjust index of timeline successfully!',
                timelines: timelines
            })
        }).catch(err => {
            console.log("adjust index timeline" + err.message);
            res.status(500).send({
                success: false,
                message: "Đã có lỗi xảy ra"
            });
        })
}

exports.getOrderOfTimeLine = async (req, res) => {
    const data = req.subject;
    let result = {
        _id: data._id,
        name: data.name,
        timelines: _.sortBy(data.timelines.map((value) => {
            return { _id: value._id, name: value.name, description: value.description, index: value.index, isDeleted: value.isDeleted };
        }), ['index']),
    };
    res.send({
        success: true,
        orderTimeline: result
    });
}

exports.getDeadline = async (req, res) => {
    db.find({ 'studentIds': req.code, isDeleted: false })
        .then(function (listSubject) {
            let deadline = [];
            const today = Date.now();
            listSubject.forEach(subject => {
                subject.timelines.forEach((timeline) => {
                    if (!timeline.isDeleted) {
                        let exams = timeline.exams.reduce((preExams, currentExam) => {
                            if (currentExam.expireTime.getTime() < today || currentExam.isDeleted) {
                                return preExams;
                            }
                            var submission = currentExam.submissions.find(value => value.idStudent == req.idUser)
                            let exam = {
                                subject: {
                                    _id: subject._id,
                                    name: subject.name
                                },
                                idTimeline: timeline._id,
                                _id: currentExam._id,
                                name: currentExam.name,
                                expireTime: currentExam.expireTime,
                                timeRemain: (new Date(currentExam.expireTime - today)).getTime(),
                                isSubmit: submission ? true : false,
                                type: 'exam'
                            }
                            return (preExams.concat(exam));
                        }, []);
                        let assignments = timeline.assignments.reduce((preAssignments, currentAssignment) => {
                            if (currentAssignment.setting.expireTime.getTime() < today || currentAssignment.isDeleted) {
                                return preAssignments;
                            }
                            let submission = currentAssignment.submissions.find(value => value.idStudent == req.idUser);
                            return {
                                subject: {
                                    _id: subject._id,
                                    name: subject.name
                                },
                                idTimeline: timeline._id,
                                _id: currentAssignment._id,
                                name: currentAssignment.name,
                                expireTime: currentAssignment.setting.expireTime,
                                timeRemain: (new Date(currentAssignment.setting.expireTime - today)).getTime(),
                                isSubmit: submission ? true : false,
                                type: 'assignment'
                            }
                        }, []);

                        let surveys = timeline.surveys.reduce((preSurveys, currentSurvey) => {
                            if (currentSurvey.expireTime.getTime() < today || currentSurvey.isDeleted) {
                                return preSurveys;
                            }
                            let reply = currentSurvey.responses.find(value => value.idStudent == req.idUser);
                            return {
                                subject: {
                                    _id: subject._id,
                                    name: subject.name
                                },
                                idTimeline: timeline._id,
                                _id: currentSurvey._id,
                                name: currentSurvey.name,
                                expireTime: currentSurvey.expireTime,
                                timeRemain: (new Date(currentSurvey.expireTime - today)).getTime(),
                                isSubmit: reply ? true : false,
                                type: 'survey'
                            }
                        }, []);

                        deadline = deadline.concat(exams, assignments, surveys);
                    }
                });
            });

            res.send({
                success: true,
                deadline: _.sortBy(deadline, ['expireTime'])
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while listing subject.",
            });
        });
}

exports.getListStudent = async (req, res) => {
    const subject = req.subject;

    var info = await Promise.all(subject.studentIds.map(async function (value) {
        var student = await userDb.findOne({ code: value }, 'code emailAddress firstName surName urlAvatar')
            .then(value => {
                return value
            });
        return student;
    }));
    res.send({
        success: true,
        students: info
    });
}

exports.getSubjectTranscript = async (req, res) => {
    let subject = req.subject;
    let today = Date.now();
    let fields = await getListAssignmentExam(subject, today);

    if (req.user.idPrivilege === 'student') {
        let transcript = await Promise.all(fields.map(async (field) => {
            let submission = await field.submissions.find(value => value.idStudent == req.user._id);
            let grade = 0;
            let status;
            if (field.type === 'exam') {
                if (submission) {
                    grade = submission.grade;
                    status = 'completed';
                } else if (field.isRemain) {
                    grade = null;
                    status = 'notSubmit';
                } else {
                    grade = 0;
                    status = 'completed'
                }
            } else {
                if (submission) {
                    if (submission.isGrade) {
                        grade = submission.grade;
                        status = 'completed';
                    } else {
                        grade = null;
                        status = 'notGrade';
                    }
                } else if (field.isRemain) {
                    grade = null;
                    status = 'notSubmit';
                } else {
                    grade = 0;
                    status = 'completed'
                }
            }
            return {
                name: field.name,
                grade: grade,
                status: status
            }
        }))
        return res.send(transcript);
    } else {
        let transcript = await Promise.all(fields.map(async (field) => {
            let submissions = await Promise.all(subject.studentIds.map(
                async (value) => {
                    let student = await userDb.findOne({ code: value }, 'code firstName surName urlAvatar')
                        .then(value => { return value });

                    let submission = field.submissions.find(value => value.idStudent == student._id);
                    let isRemain = field.isRemain;

                    if (submission) {
                        if (field.type === 'exam') {
                            return {
                                student: student,
                                grade: submission.grade,
                                status: 'completed'
                            }
                        } else if (field.type === 'assignment') {
                            if (submission.isGrade) {
                                return {
                                    student: student,
                                    grade: submission.grade,
                                    status: 'completed'
                                }
                            } else {
                                return {
                                    student: student,
                                    grade: null,
                                    status: 'notGrade'
                                }
                            }
                        }

                    } else if (isRemain) {
                        return {
                            student: student,
                            grade: null,
                            status: 'notSubmit'
                        }
                    } else {
                        return {
                            student: student,
                            grade: 0,
                            status: 'completed'
                        }
                    }
                }))
            return {
                _id: field._id,
                name: field.name,
                submissions: submissions
            }
        }));

        return res.send(transcript);
    }
}

exports.getSubjectTranscriptTotal = async (req, res) => {
    let subject = req.subject;
    let today = Date.now();
    let assignmentOrExam = await getListAssignmentExam(subject, today);

    let fields = { 'c0': 'MSSV', 'c1': 'Họ', 'c2': 'Tên' }
    let ratios = { 'c0': null, 'c1': null, 'c2': null }
    let count = 3;
    let totalRatio = 0;
    assignmentOrExam.forEach(value => {
        let key = 'c' + count++;
        fields[key] = value.name;
        let transcript = subject.transcript.find(ratio => ratio.idField == value._id);
        ratios[key] = {
            _id: transcript._id,
            ratio: transcript.ratio
        };
        totalRatio += transcript.ratio;
    });

    let data = await Promise.all(subject.studentIds.map(
        async (value) => {
            let student = await userDb.findOne({ code: value }, 'code firstName surName urlAvatar')
                .then(value => { return value });
            let data = {
                'c0': student.code,
                'c1': student.surName,
                'c2': student.firstName
            };
            let count = 3;
            let grade = await Promise.all(assignmentOrExam.map(async (value) => {
                let submission = value.submissions.find(value => value.idStudent == student._id);
                if (submission) {
                    return submission.grade;
                } else if (value.isRemain) {
                    return null;
                } else {
                    return 0;
                }

            }));
            let total = 0;
            grade.forEach(value => {
                let key = 'c' + count++;
                data[key] = value;
                total += (data[key] * ratios[key].ratio);
            });
            let key = 'c' + count;
            data[key] = (total / totalRatio).toFixed(2);
            ratios[key] = null;
            fields[key] = 'Trung bình';
            return data;
        }
    ));

    return res.send({
        fields: fields,
        ratio: ratios,
        data: data
    });

}

exports.updateRatioTranscript = async (req, res) => {
    let subject = req.subject;
    let adjust = req.body;
    await adjust.forEach(async (value) => {
        let transcript = await subject.transcript.find(ratio => ratio._id == value._id);
        if (transcript) {
            transcript.ratio = value.ratio;
        }
    });

    await subject.save()
        .then(() => {
            // res.send({
            //     success: true,
            //     message: 'Update ratio transcript successfully!'
            // });
            return this.getSubjectTranscriptTotal(req, res);
        }).catch(err => {
            console.log("adjust ratio transcript" + err.message);
            res.status(500).send({
                success: false,
                message: 'Update ratio transcript failure!'
            });
        })
}

exports.exportSubject = async (req, res) => {
    await db.findById(req.params.idSubject)
        .then(async (subject) => {
            if (!subject) {
                return res.status(404).send({
                    success: false,
                    message: "Not found subject",
                });
            }

            let timelines = subject.timelines;
            timelines = await Promise.all(timelines.map(async (timeline) => {
                let surveys = await Promise.all(timeline.surveys.map(async (survey) => {
                    return {
                        name: survey.name,
                        description: survey.description,
                        code: survey.code,
                        expireTime: survey.expireTime
                    }
                }));
                let forums = timeline.forums.map(forum => {
                    return {
                        name: forum.name,
                        description: forum.description
                    }
                });
                let exams = timeline.exams.map(exam => {
                    return {
                        name: exam.name,
                        content: exam.content,
                        startTime: exam.startTime,
                        expireTime: exam.expireTime,
                        setting: exam.setting
                    }
                });
                let information = timeline.information.map(info => {
                    return {
                        name: info.name,
                        content: info.content
                    }
                });
                let assignments = timeline.assignments.map(assignment => {
                    return {
                        name: assignment.name,
                        content: assignment.content,
                        attachments: assignment.attachments,
                        setting: assignment.setting
                    }
                });
                return {
                    name: timeline.name,
                    description: timeline.description,
                    surveys: surveys,
                    forums: forums,
                    exams: exams,
                    information: information,
                    assignments: assignments,
                    files: timeline.files,
                    index: timeline.index
                }
            }));



            let surveyBank = subject.surveyBank.map((questionnaire) => {
                let questions = questionnaire.questions.map(question => {
                    if (question.typeQuestion === 'choice' || question.typeQuestion === 'multiple') {
                        let answers = question.answer.map(answer => {
                            return answer.content;
                        });
                        return {
                            question: question.question,
                            answer: answers,
                            typeQuestion: question.typeQuestion
                        }
                    } else {
                        return {
                            question: question.question,
                            typeQuestion: question.typeQuestion
                        }
                    }
                });
                return {
                    _id: questionnaire._id,
                    name: questionnaire.name,
                    questions: questions
                }
            })

            subject = {
                name: subject.name,
                idLecture: subject.idLecture,
                timelines: timelines,
                quizBank: subject.quizBank,
                surveyBank: surveyBank
            }

            res.attachment(`${subject.name}.json`)
            res.type('json')
            res.send(subject)
            // res.send({
            //     success: true,
            //     subject: {
            //         _id: subject._id,
            //         name: subject.name,
            //         lecture: teacher,
            //         studentCount: subject.studentIds.length,
            //         isDeleted: subject.isDeleted
            //     }
            // });

        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
}

exports.getDeadlineBySubject = async (req, res) => {
    let deadline = [];
    const today = Date.now();
    let subject = req.subject;
    subject.timelines.forEach((timeline) => {
        if (!timeline.isDeleted) {
            let exams = timeline.exams.reduce((preExams, currentExam) => {
                if (currentExam.expireTime.getTime() < today || currentExam.isDeleted) {
                    return preExams;
                }
                var submission = currentExam.submissions.find(value => value.idStudent == req.idStudent)
                let exam = {
                    idTimeline: timeline._id,
                    _id: currentExam._id,
                    name: currentExam.name,
                    expireTime: currentExam.expireTime,
                    timeRemain: (new Date(currentExam.expireTime - today)).getTime(),
                    isSubmit: submission ? true : false,
                    type: 'exam'
                }
                return (preExams.concat(exam));
            }, []);
            let assignments = timeline.assignments.reduce((preAssignments, currentAssignment) => {
                if (currentAssignment.setting.expireTime.getTime() < today || currentAssignment.isDeleted) {
                    return preAssignments;
                }
                let submission = currentAssignment.submissions.find(value => value.idStudent == req.idStudent);
                return {
                    idTimeline: timeline._id,
                    _id: currentAssignment._id,
                    name: currentAssignment.name,
                    expireTime: currentAssignment.setting.expireTime,
                    timeRemain: (new Date(currentAssignment.setting.expireTime - today)).getTime(),
                    isSubmit: submission ? true : false,
                    type: 'assignment'
                }
            }, []);

            let surveys = timeline.surveys.reduce((preSurveys, currentSurvey) => {
                if (currentSurvey.expireTime.getTime() < today || currentSurvey.isDeleted) {
                    return preSurveys;
                }
                let reply = currentSurvey.responses.find(value => value.idStudent == req.idStudent);
                return {
                    idTimeline: timeline._id,
                    _id: currentSurvey._id,
                    name: currentSurvey.name,
                    expireTime: currentSurvey.expireTime,
                    timeRemain: (new Date(currentSurvey.expireTime - today)).getTime(),
                    isSubmit: reply ? true : false,
                    type: 'survey'
                }
            }, []);

            deadline = deadline.concat(exams, assignments, surveys);
        }
    });

    res.send({
        success: true,
        deadline: _.sortBy(deadline, ['expireTime'])
    });
}

//Function

const getListAssignmentExam = async (subject, today) => {
    let assignmentOrExam = await subject.timelines.reduce(
        async (preField, currentTimeline) => {
            if (currentTimeline.isDeleted) {
                let result = await preField;
                return result;
            } else {
                let exams = await Promise.all(currentTimeline.exams.map(async (exam) => {
                    if (exam.isDeleted) {
                        return null;
                    }
                    let exists = [];
                    let submissions = await exam.submissions.reduce(function (prePromise, submission) {
                        let exist = exists.find(value => value.idStudent == submission.idStudent);
                        if (exist) {
                            let existSubmission = prePromise[exist.index];
                            prePromise[exist.index].grade = existSubmission.grade >= submission.grade ? existSubmission.grade : submission.grade;
                            return prePromise;
                        } else {
                            exists = exists.concat({
                                idStudent: submission.idStudent,
                                grade: submission.grade,
                                index: prePromise.length
                            })
                            return prePromise.concat({
                                // _id: submission._id,
                                idStudent: submission.idStudent,
                                grade: submission.grade
                            })
                        }
                    }, []);
                    let isRemain = today <= exam.expireTime;
                    return {
                        // idSubject: subject._id,
                        // idTimeline: currentTimeline._id,
                        _id: exam._id,
                        name: exam.name,
                        isRemain: isRemain,
                        submissions: submissions,
                        type: 'exam',
                    }
                }));
                let assignments = await Promise.all(currentTimeline.assignments.map(async (assignment) => {
                    if (assignment.isDeleted) {
                        return null;
                    }

                    let submissions = await Promise.all(assignment.submissions.map(async (submission) => {
                        return {
                            // _id: submission._id,
                            idStudent: submission.idStudent,
                            grade: submission.feedBack ? submission.feedBack.grade : 0,
                            isGrade: submission.feedBack ? true : false,
                        }
                    }));

                    let isRemain = today <= assignment.setting.expireTime;

                    return {
                        // idSubject: subject._id,
                        // idTimeline: currentTimeline._id,
                        _id: assignment._id,
                        name: assignment.name,
                        isRemain: isRemain,
                        submissions: submissions,
                        type: 'assignment'
                    }
                }));
                let currentFields = exams.concat(assignments);
                let result = await preField;
                return result.concat(currentFields);
            }
        }, []);
    assignmentOrExam = await (assignmentOrExam.filter((value) => {
        return (value !== null);
    }));

    return assignmentOrExam;
}