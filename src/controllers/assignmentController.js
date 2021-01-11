const User = require('../models/user');
// const multer = require('multer');
// const fs = require('fs');
const moment = require('moment');
const isToday = require('../common/isToday');

exports.create = async (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    let data = req.body.data;
    let file = [];
    if (data.file) {
        file = data.file.map(value => {
            return {
                name: value.name,
                path: value.path,
                type: value.type
            }
        });
    }
    const model = {
        name: data.name,
        content: data.content,
        setting: {
            startTime: new Date(data.setting.startTime),
            expireTime: new Date(data.setting.expireTime),
            isOverDue: data.setting.isOverDue,
            overDueDate: data.setting.isOverDue ? new Date(data.setting.overDueDate) : null,
            // fileCount: data.setting.fileCount,
            fileSize: data.setting.fileSize,
        },
        attachments: file
    };

    let length = timeline.assignments.push(model);

    await subject.save()
        .then(() => {
            let assignment = timeline.assignments[length - 1]
            assignment = {
                _id: assignment._id,
                name: assignment.name,
                description: assignment.description,
                time: assignment.createdAt,
                isNew: isToday(assignment.createdAt),
                isDeleted: assignment.isDeleted
            }
            res.send({
                success: true,
                assignment
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

exports.find = async (req, res) => {
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

        } else if (assignment.setting.isOverDue && today >= assignment.setting.startTime) {
            if (today <= assignment.setting.overDueDate) {
                isCanSubmit = true;
            }
        }
        let gradeStatus = false;
        if (submission && submission.feedBack) {
            gradeStatus = true;
        }
        res.send({
            success: true,
            assignment: {
                _id: assignment._id,
                name: assignment.name,
                content: assignment.content,
                attachments: assignment.attachments,
                submissionStatus: submission ? true : false,
                gradeStatus: gradeStatus,
                setting: assignment.setting,
                isCanSubmit: isCanSubmit,
                timingRemain: timingRemain,
                submission: submission || null
            }
        })
    } else {
        let submissions = await Promise.all(assignment.submissions
            .map(async function (submit) {
                var student = await User.findById(submit.idStudent, 'code firstName surName urlAvatar')
                    .then(value => {
                        return value
                    });
                return {
                    _id: submit._id,
                    student: student,
                    submitTime: submit.submitTime,
                    file: submit.file,
                    feedBack: submit.feedBack || null
                };
            }));

        res.send({
            success: true,
            assignment: {
                _id: assignment._id,
                name: assignment.name,
                content: assignment.content,
                isDeleted: assignment.isDeleted,
                attachments: assignment.attachments || null,
                setting: assignment.setting,
                submissionCount: assignment.submissions.length,
                submission: submissions
            }
        });
    }
};

exports.findUpdate = async (req, res) => {
    let data = req.subject;
    const timeline = await data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }
    const assignment = await timeline.assignments.find(value => value._id == req.params.idAssignment);

    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: "Not found assignment",
        });
    }

    res.send({
        success: true,
        assignment: {
            _id: assignment._id,
            name: assignment.name,
            content: assignment.content,
            isDeleted: assignment.isDeleted,
            attachments: assignment.attachments || null,
            setting: assignment.setting,
        }
    });

};

exports.findAll = async (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    let assignments = timeline.assignments.map((value) => {
        return {
            _id: value._id,
            name: value.name,
            content: value.content,
            startTime: value.setting.startTime,
            expireTime: value.setting.expireTime
        }
    });
    res.send({
        success: true,
        assignments
    })
};

exports.update = async (req, res) => {
    let data = req.body.data;
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
    if (data.name) {
        assignment.name = data.name;
    }
    if (data.content) {
        assignment.content = data.content;
    }
    if (data.setting) {
        assignment.setting = {
            startTime: new Date(data.setting.startTime),
            expireTime: new Date(data.setting.expireTime),
            isOverDue: data.setting.isOverDue,
            overDueDate: data.setting.isOverDue ? new Date(data.setting.overDueDate) : null,
            fileSize: data.setting.fileSize
        }
    }
    assignment.isDeleted = data.isDeleted || false;

    if (data.file && data.file.length > 0) {
        let file = data.file.map(value => {
            return {
                name: value.name,
                path: value.path,
                type: value.type
            }
        });
        assignment.attachments = file;
    }


    await subject.save()
        .then(() => {
            res.send(
                {
                    success: true,
                    message: 'Update assignment successfully!',
                    assignment: {
                        _id: assignment._id,
                        name: assignment.name,
                        description: assignment.description,
                        time: assignment.createdAt,
                        isNew: isToday(assignment.createdAt),
                        isDeleted: assignment.isDeleted
                    }
                }
            );
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

    if (!assignment) {
        return res.status(404).send({
            success: false,
            message: "Not found assignment",
        });
    }
    const indexAssignment = timeline.assignments.indexOf(assignment);
    timeline.assignments.splice(indexAssignment, 1);

    data.save()
        .then(() => {
            res.send({
                success: true,
                message: "Delete Assignment Successfully!"
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};

exports.hideOrUnhide = async (req, res) => {
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
    assignment.isDeleted = !assignment.isDeleted;

    data.save()
        .then(() => {
            let message;
            if (assignment.isDeleted) {
                message = `Hide assignment ${assignment.name} successfully!`
            } else {
                message = `Unhide assignment  ${assignment.name} successfully!`
            }
            res.send({
                success: true,
                message,
                assignment: {
                    _id: assignment._id,
                    name: assignment.name,
                    description: assignment.description,
                    time: assignment.createdAt,
                    isNew: isToday(assignment.createdAt),
                    isDeleted: assignment.isDeleted
                }
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};

// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         let subject = req.query.idSubject;
//         let timeline = req.query.idTimeline;
//         let assignment = req.params.idAssignment;
//         let path = `${appRoot}/uploads/${subject}/${timeline}/${assignment}/`;
//         if (!fs.existsSync(path)) {
//             fs.mkdirSync(path, { recursive: true });
//         }
//         cb(null, path)
//     },
//     filename: function(req, file, cb) {
//         let name = Date.now() + '-' + file.originalname;
//         cb(null, name)
//     }
// });

exports.submit = async (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment && value.isDeleted === false);
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
        // var upload = multer({
        //     storage: storage,
        //     limits: {
        //         fileSize: setting.fileSize * 1020 * 1024
        //     }
        // }).single('file');
        // upload(req, res, function(err) {
        //     if (err) {
        //         return res.status(500).send({
        //             success: false,
        //             message: "Error uploading file."
        //         });
        //     } else if (!req.file) {
        //         return res.status(400).send({
        //             success: false,
        //             message: "No file submit!"
        //         });
        //     }
        //     console.log(req.file);
        //     console.log(req.idStudent);
        //     let file = {
        //         name: req.file.originalname,
        //         path: req.file.path,
        //         type: req.file.path.split('.').pop(),
        //         uploadDay: Date.now()
        //     }
        //     var index = 0;
        //     var submitted = assignment.submissions.find(value => value.idStudent == req.idStudent);
        //     if (submitted) {
        //         index = assignment.submissions.indexOf(submitted);
        //         submitted.submitTime = today;
        //         console.log(submitted.file.path);
        //         fs.unlink(submitted.file.path, function(err) {
        //             if (err) {
        //                 console.log('Delete previous file failure');
        //                 console.log(err);
        //             } else {
        //                 console.log('Delete previous file successfully');
        //             }
        //         })
        //         submitted.file = file;
        //     } else {
        //         var submission = {
        //             idStudent: req.idStudent,
        //             submitTime: today,
        //             file: file
        //         }
        //         index = assignment.submissions.push(submission) - 1;
        //     }
        //     data.save()
        //         .then(() => {
        //             res.send(assignment.submissions[index]);
        //         })
        //         .catch((err) => {
        //             if (err.name === 'ValidationError') {
        //                 const key = Object.keys(err.errors)[0];
        //                 res.status(400).send({
        //                     success: false,
        //                     message: err.errors[key].message,
        //                 });
        //             } else {
        //                 res.status(500).send({
        //                     success: false,
        //                     message: err.message,
        //                 });
        //             }
        //         });
        // });

        let file = {
            name: req.body.file.name,
            path: req.body.file.path,
            type: req.body.file.type,
            uploadDay: Date.now()
        }
        console.log(file);
        var index = 0;
        var submitted = assignment.submissions.find(value => value.idStudent == req.idStudent);
        if (submitted) {
            index = assignment.submissions.indexOf(submitted);
            submitted.submitTime = today;
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
                res.send({
                    success: true,
                    submission: assignment.submissions[index]
                });
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
        let message = "";
        if (today <= setting.startTime) {
            message = "Chưa tới thời gian nộp bài!";
        } else {
            message = "Đã quá thời hạn nộp bài!"
        }
        res.status(403).send({
            success: false,
            message: message
        });
    }
};

// exports.download = async (req, res) => {
//     let data = req.subject;
//     const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
//     if (!timeline) {
//         return res.status(404).send({
//             success: false,
//             message: "Not found timeline",
//         });
//     }

//     const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
//     if (!assignment) {
//         return res.status(404).send({
//             success: false,
//             message: "Not found assignment",
//         });
//     }
//     console.log(req.user.idPrivilege);
//     if (req.user.idPrivilege === 'student') {
//         console.log(req.user._id);
//         var submission = assignment.submissions.find(value => value._id == req.params.idSubmission);
//         if (!submission || submission.idStudent != req.user._id) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Not found submission",
//             });
//         }
//         res.download(submission.file.path);
//     } else {
//         var submission = assignment.submissions.find(value => value._id == req.params.idSubmission);
//         if (!submission) {
//             return res.status(404).send({
//                 success: false,
//                 message: "Not found submission",
//             });
//         }
//         res.download(submission.file.path);
//     }

// }

exports.gradeSubmission = async (req, res) => {
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
            .then(async () => {
                let student = await User.findById(submitted.idStudent, 'code firstName surName');
                res.send({
                    success: true,
                    message: `Grade submission of student with code: ${student.code} successfully!`
                });
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

exports.commentFeedback = async (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment && value.isDeleted === false);
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
        submitted.feedBack.comment = req.body.comment;

        data.save()
            .then(() => {
                res.send({
                    success: true,
                    message: 'Comment feedback of submission successfully!',
                    submission: submitted
                });
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