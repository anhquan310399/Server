const User = require('../models/user');
const multer = require('multer');
const fs = require('fs');
const moment = require('moment');
exports.create = async(req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    let data = req.body.data;
    const model = {
        name: data.name,
        content: data.content,
        setting: {
            startTime: data.setting.startTime,
            expireTime: data.setting.expireTime,
            isOverDue: data.setting.isOverDue,
            overDueDate: data.setting.overDueDate,
            // fileCount: data.setting.fileCount,
            fileSize: data.setting.fileSize,
        }
    };

    let length = timeline.assignments.push(model);

    await subject.save()
        .then(() => {
            res.send(timeline.assignments[length - 1]);
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
    let data = req.subject;
    const timeline = await data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    let assignment;
    if (req.user.idPrivilege === 'student') {
        assignment = await timeline.assignments.find(value => value._id == req.params.idAssignment && value.isDeleted == false);

    } else {
        assignment = await timeline.assignments.find(value => value._id == req.params.idAssignment);
    }
    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: "Not found assignment",
        });
    }
    let today = Date.now();
    const timingRemain = moment(assignment.setting.expireTime).from(moment(today));

    if (req.user.idPrivilege === 'student') {
        let submission = assignment.submissions.find(value => value.idStudent == req.user._id);
        console.log(submission);
        let isCanSubmit = false;
        if (today >= assignment.setting.startTime && today < assignment.setting.expireTime) {
            isCanSubmit = true;

        } else if (assignment.setting.isOverDue) {
            if (today <= assignment.setting.overDueDate) {
                isCanSubmit = true;
            }
        }
        if (submission) {
            res.send({
                _id: assignment._id,
                name: assignment.name,
                content: assignment.content,
                submissionStatus: true,
                gradeStatus: submission.feedBack ? true : false,
                setting: assignment.setting,
                isCanSubmit: isCanSubmit,
                timingRemain: timingRemain,
                submission: submission
            })
        } else {
            res.send({
                _id: assignment._id,
                name: assignment.name,
                content: assignment.content,
                submissionStatus: false,
                gradeStatus: false,
                setting: assignment.setting,
                isCanSubmit: isCanSubmit,
                timingRemain: timingRemain,
                submission: null
            });
        }
    } else {
        let submissions = await Promise.all(assignment.submissions
            .map(async function(submit) {
                var student = await User.findById(submit.idStudent, 'code firstName surName urlAvatar')
                    .then(value => {
                        return value
                    });
                return {
                    _id: submit._id,
                    student: student,
                    submitTime: submit.submitTime,
                    file: submit.file,
                    feedBack: submit.feedBack
                };
            }));

        res.send({
            _id: assignment._id,
            name: assignment.name,
            content: assignment.content,
            setting: assignment.setting,
            submissionCount: assignment.submissions.length,
            submission: submissions
        });
    }
};

exports.findAll = async(req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    res.send(timeline.assignments.map((value) => {
        return {
            _id: value._id,
            name: value.name,
            content: value.content,
            startTime: value.setting.startTime,
            expireTime: value.setting.expireTime
        }
    }));
};

exports.update = async(req, res) => {
    let data = req.body.data;

    if (!(data.name && data.content && data.setting)) {
        return res.status(400).send({
            success: false,
            message: 'Lack of data'
        });
    }

    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: 'Not found assignment'
        });
    }

    assignment.name = data.name;
    assignment.content = data.content;
    assignment.setting = {
        startTime: data.setting.startTime,
        expireTime: data.setting.expireTime,
        isOverDue: data.setting.isOverDue,
        overDueDate: data.setting.overDueDate,
        // fileCount: data.setting.fileCount,
        fileSize: data.setting.fileSize
    }

    await subject.save()
        .then(() => {
            res.send({
                _id: assignment._id,
                name: assignment.name,
                content: assignment.content,
                setting: assignment.setting
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

exports.delete = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    // const indexAssignment = timeline.assignments.indexOf(assignment);
    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: "Not found assignment",
        });
    }
    assignment.isDeleted = true;

    // timeline.assignments.splice(indexAssignment, 1);

    data.save()
        .then(() => {
            res.send({ message: "Delete Assignment Successfully!" });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let subject = req.query.idSubject;
        let timeline = req.query.idTimeline;
        let assignment = req.params.idAssignment;
        let path = `${appRoot}/uploads/${subject}/${timeline}/${assignment}/`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path)
    },
    filename: function(req, file, cb) {
        let name = Date.now() + '-' + file.originalname;
        cb(null, name)
    }
});

exports.submit = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: "Not found assignment",
        });
    }

    let today = Date.now();
    const setting = assignment.setting;
    if ((today >= setting.startTime && today <= setting.expireTime) ||
        (setting.isOverDue && today <= setting.overDueDate && today >= setting.startTime)) {
        var upload = multer({
            storage: storage,
            limits: {
                fileSize: setting.fileSize * 1020 * 1024
            }
        }).single('file');
        upload(req, res, function(err) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error uploading file."
                });
            } else if (!req.file) {
                return res.status(400).send({
                    success: false,
                    message: "No file submit!"
                });
            }
            console.log(req.file);
            console.log(req.idStudent);
            let file = {
                name: req.file.originalname,
                path: req.file.path,
                type: req.file.path.split('.').pop(),
                uploadDay: Date.now()
            }
            var index = 0;
            var submitted = assignment.submissions.find(value => value.idStudent == req.idStudent);
            if (submitted) {
                index = assignment.submissions.indexOf(submitted);
                submitted.submitTime = today;
                console.log(submitted.file.path);
                fs.unlink(submitted.file.path, function(err) {
                    if (err) {
                        console.log('Delete previous file failure');
                        console.log(err);
                    } else {
                        console.log('Delete previous file successfully');
                    }
                })
                submitted.file = file;
            } else {
                var submission = {
                    idStudent: req.idStudent,
                    submitTime: today,
                    file: file
                }
                index = assignment.submissions.push(submission) - 1;
            }
            data.save()
                .then(() => {
                    res.send(assignment.submissions[index]);
                })
                .catch((err) => {
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
        });

    } else {
        let message = "";
        if (today <= setting.startTime) {
            message = "Chưa tới thời gian nộp bài!";
        } else {
            message = "Đã quá thời hạn nộp bài!"
        }
        res.status(500).send({
            success: false,
            message: message
        });
    }
};

exports.download = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: "Not found assignment",
        });
    }
    console.log(req.user.idPrivilege);
    if (req.user.idPrivilege === 'student') {
        console.log(req.user._id);
        var submission = assignment.submissions.find(value => value._id == req.params.idSubmission);
        if (!submission || submission.idStudent != req.user._id) {
            return res.status(404).send({
                success: false,
                message: "Not found submission",
            });
        }
        res.download(submission.file.path);
    } else {
        var submission = assignment.submissions.find(value => value._id == req.params.idSubmission);
        if (!submission) {
            return res.status(404).send({
                success: false,
                message: "Not found submission",
            });
        }
        res.download(submission.file.path);
    }

}

exports.gradeSubmission = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: "Not found assignment",
        });
    }

    var submitted = assignment.submissions.find(value => value._id == req.params.idSubmission);
    if (submitted) {
        submitted.feedBack = {
            grade: req.body.grade,
            gradeOn: Date.now(),
            gradeBy: req.idTeacher
        }

        data.save()
            .then(() => {
                res.send(submitted);
            })
            .catch((err) => {
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
    } else {
        res.status(404).send({
            success: false,
            message: "Not found submission!"
        });
    }
}

exports.commentFeedback = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: "Not found assignment",
        });
    }

    var submitted = assignment.submissions.find(value => value.idStudent == req.idStudent);
    if (submitted) {
        if (typeof submitted.feedBack == 'undefined') {
            return res.status(401).send({
                success: false,
                message: "Chưa chấm điểm không thể comment!"
            });
        }
        submitted.feedBack.comment = req.body.data.comment;

        data.save()
            .then(() => {
                res.send(submitted);
            })
            .catch((err) => {
                res.status(500).send({
                    success: false,
                    message: err.message,
                });
            });
    } else {
        res.status(404).send({
            success: false,
            message: "Not found submission!"
        });
    }
}