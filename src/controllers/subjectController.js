const db = require("../models/subject");
const userDb = require('../models/user');
const _ = require('lodash');
const isToday = require('../common/isToday');
exports.create = async(req, res) => {
    // Validate request
    const data = new db({
        _id: req.body._id,
        name: req.body.name,
        lectureId: req.body.lectureId,
        studentIds: req.body.studentIds,
        timelines: req.body.timelines
    });

    await data.save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.findAll = async(req, res) => {
    var idPrivilege = req.idPrivilege;
    if (idPrivilege === 'teacher') {
        db.find({ lectureId: req.idUser, isDeleted: false })
            .then((data) => {
                var info = data.map(function(value) {
                    return { _id: value._id, name: value.name };
                });
                res.send(info);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while listing subject.",
                });
            });
    } else if (idPrivilege === 'student') {
        db.find({ 'studentIds': req.idUser, isDeleted: false })
            .then(async function(data) {
                var info = await Promise.all(data.map(async function(value) {
                    var teacher = await userDb.findById(value.lectureId, 'firstName surName urlAvatar')
                        .then(value => {
                            return value
                        });
                    return { _id: value._id, name: value.name, lecture: teacher };
                }));
                res.send(info);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while listing subject.",
                });
            });
    }

};

exports.find = async(req, res) => {
    let subject = req.subject;
    let timelines = req.subject.timelines;
    if (req.idPrivilege === 'student') {
        timelines.filter((value) => { if (value.isDeleted === false) return true });
    }
    let teacher = await userDb.findById(subject.lectureId, 'firstName surName urlAvatar')
        .then(value => { return value });

    let result = {
        _id: subject._id,
        name: subject.name,
        lecture: teacher,
        timelines: _.sortBy(timelines.map((value) => {
            let forums = value.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description, time: forum.createdAt, isNew: isToday(forum.updatedAt) } });
            let exams = value.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description, time: exam.createdAt, isNew: isToday(exam.createdAt) } });
            let information = value.information.map((info) => { return { _id: info._id, name: info.name, content: info.content, time: info.createdAt, isNew: isToday(info.updatedAt) } });
            let assignments = value.assignments.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description, time: assign.createdAt, isNew: isToday(assign.createdAt) } });
            if (req.idPrivilege === 'student') {
                return { _id: value._id, name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments, files: value.files, index: value.index };
            } else {
                return { _id: value._id, name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments, files: value.files, index: value.index, isDeleted: value.isDeleted };
            }
        }), ['index']),
    };
    res.send(result);
};

exports.update = async(req, res) => {
    if (!req.body || !(req.body.name && req.body.lectureId)) {
        return res.status(400).send({
            message: "Lack of information",
        });
    };
    await db.findByIdAndUpdate(
            req.params.idSubject, {
                name: req.body.name,
                lectureId: req.body.lectureId
            }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found Subject",
                });
            }
            res.send("Update Successfully");
        })
        .catch((err) => {
            console.log("Update subject: " + err.message);
            return res.status(500).send({
                message: "Update Failure"
            });
        });
};

exports.delete = async(req, res) => {
    await db.findByIdAndUpdate(
            req.params.idSubject, {
                isDeleted: true
            }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found Subject",
                });
            }
            res.send("Delete Successfully");
        })
        .catch((err) => {
            console.log("Delete subject" + err.message);
            return res.status(500).send({
                message: "Delete Failure"
            });
        });
};

exports.addAllStudents = (req, res) => {
    // Validate request
    db.findById(req.params.idSubject)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found subject",
                });
            }
            var list = data.studentIds.concat(req.body).sort();
            list = list.filter((a, b) => list.indexOf(a) === b);
            data.studentIds = list;
            data.save()
                .then((data) => {
                    // res.send(data);
                    res.send("Add Student Successfully!")
                })
                .catch((err) => {
                    console.log("Add student" + err.message);
                    res.status(500).send({
                        message: "Add student failure"
                    });
                });
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message,
            });
        });
};

exports.addStudent = (req, res) => {
    // Validate request
    let subject = req.subject;

    let idStudent = subject.studentIds.find(value => { return value === req.body.idStudent });
    if (idStudent) {
        return res.send({ message: 'This student has already in subject' });
    }

    userDb.findOne({ _id: req.body.idStudent })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "Not found student with id: " + req.body.idStudent });
            }
            subject.studentIds.push(req.body.idStudent);
            subject.save()
                .then((data) => {
                    // res.send(data);
                    res.send({ message: "Add Student Successfully!" });
                })
                .catch((err) => {
                    console.log("Add student" + err.message);
                    res.status(500).send({
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
        return res.send({ message: 'Not found this student with id: ' + req.body.idStudent });
    }
    subject.studentIds.splice(index, 1);
    subject.save()
        .then((data) => {
            // res.send(data);
            res.send({ message: "Remove Student Successfully!" });
        })
        .catch((err) => {
            console.log("Remove student" + err.message);
            res.status(500).send({
                message: "Remove student failure"
            });
        });
};


exports.adjustOrderOfTimeline = async(req, res) => {
    const adjust = req.body;
    const subject = req.subject;
    await adjust.forEach(element => {
        var timeline = subject.timelines.find(x => x._id == element._id);
        console.log(timeline);
        timeline.index = element.index;
    });
    await subject.save()
        .then(data => {
            let result = {
                _id: data._id,
                name: data.name,
                timelines: _.sortBy(data.timelines.map((value) => {
                    return { _id: value._id, name: value.name, description: value.description, index: value.index, isDeleted: value.isDeleted };
                }), ['index']),
            };
            res.send(result);
        }).catch(err => {
            console.log("adjust index timeline" + err.message);
            res.status(500).send({ message: "Đã có lỗi xảy ra" });
        })
}

exports.getOrderOfTimeLine = async(req, res) => {
    const data = req.subject;
    let result = {
        _id: data._id,
        name: data.name,
        timelines: _.sortBy(data.timelines.map((value) => {
            return { _id: value._id, name: value.name, description: value.description, index: value.index, isDeleted: value.isDeleted };
        }), ['index']),
    };
    res.send(result);
}


exports.getDeadline = async(req, res) => {
    db.find({ 'studentIds': req.idUser, isDeleted: false })
        .then(function(listSubject) {
            let deadline = [];
            const today = Date.now();
            listSubject.forEach(subject => {
                subject.timelines.forEach(timeline => {
                    let exams = timeline.exams.map(exam => {
                        var submission = exam.submissions.find(value => value.studentId === req.idUser)
                        return {
                            idSubject: subject._id,
                            idTimeline: timeline._id,
                            _id: exam._id,
                            name: exam.name,
                            expireTime: exam.expireTime,
                            isSubmit: submission ? true : false,
                            type: 'exam'
                        }
                    }).filter(exam => { return exam.expireTime > today });
                    let assignments = timeline.assignments.map(assignment => {
                        let submission = assignment.submission.find(value => value.idStudent === req.idUser);
                        return {
                            idSubject: subject._id,
                            idTimeline: timeline._id,
                            _id: assignment._id,
                            name: assignment.name,
                            expireTime: assignment.setting.expireTime,
                            isSubmit: submission ? true : false,
                            type: 'assignment'
                        }
                    }).filter(assignment => { return assignment.expireTime > today });
                    deadline = deadline.concat(exams, assignments);
                });
            });
            res.send(deadline);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while listing subject.",
            });
        });
}

exports.getListStudent = async(req, res) => {
    const subject = req.subject;

    var info = await Promise.all(subject.studentIds.map(async function(value) {
        var student = await userDb.findById(value, 'emailAddress firstName surName urlAvatar')
            .then(value => {
                return value
            });
        return student;
    }));
    res.send(info);
}

exports.getSubjectTranscript = async(req, res) => {
    let subject = req.subject;
    let fields = await subject.timelines.reduce(
        async(preField, currentTimeline) => {
            let exams = await Promise.all(currentTimeline.exams.map(async(exam) => {
                let exists = [];
                let submissions = await exam.submissions.reduce(async function(prePromise, submission) {
                    let exist = await exists.find(value => value.idStudent == submission.studentId);
                    if (exist) {
                        let result = await prePromise;
                        let existSubmission = result[exist.index];
                        result[exist.index].grade = existSubmission.grade >= submission.grade ? existSubmission.grade : submission.grade;
                        return result;
                    } else {
                        let result = await prePromise;
                        exists = exists.concat({
                            idStudent: submission.studentId,
                            grade: submission.grade,
                            index: result.length
                        })
                        return result.concat({
                            // _id: submission._id,
                            idStudent: submission.studentId,
                            grade: submission.grade
                        })
                    }
                }, []);
                return {
                    // idSubject: subject._id,
                    // idTimeline: currentTimeline._id,
                    _id: exam._id,
                    name: exam.name,
                    submissions: submissions,
                    // type: 'exam'
                }
            }));
            let assignments = await Promise.all(currentTimeline.assignments.map(async(assignment) => {
                let submissions = await Promise.all(assignment.submission.map(async(submission) => {
                    return {
                        // _id: submission._id,
                        idStudent: submission.idStudent,
                        grade: submission.feedBack ? submission.feedBack.grade : 0
                    }
                }));

                return {
                    // idSubject: subject._id,
                    // idTimeline: currentTimeline._id,
                    _id: assignment._id,
                    name: assignment.name,
                    submissions: submissions,
                    // type: 'assignment'
                }
            }));

            let currentFields = exams.concat(assignments);
            let result = await preField;
            return result.concat(currentFields);
        }, []);

    if (req.user.idPrivilege === 'student') {
        let transcript = await Promise.all(fields.map(async(field) => {
            let submission = await field.submissions.find(value => value.idStudent == req.user._id);
            let grade = 0;
            if (submission) {
                grade = submission.grade;
            }
            return {
                _id: field._id,
                name: field.name,
                grade: grade
            }
        }))
        return res.send(transcript);
    } else {
        let transcript = await Promise.all(fields.map(async(field) => {
            let submissions = await Promise.all(subject.studentIds.map(
                async(value) => {
                    let student = await userDb.findById(value, 'firstName surName urlAvatar')
                        .then(value => { return value });

                    let submission = field.submissions.find(value => value.idStudent == student._id);
                    if (!submission) {
                        return {
                            idStudent: student._id,
                            grade: 0
                        }
                    } else {
                        return submission
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