const User = require('../models/user');
const multer = require('multer');
const fs = require('fs');

exports.create = async(req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
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
            fileCount: data.setting.fileCount,
            fileSize: data.setting.fileSize,
        }
    };

    let length = timeline.assignments.push(model);

    await subject.save()
        .then(() => {
            res.send(timeline.assignments[length - 1]);
        })
        .catch((err) => {
            const key = Object.keys(err.errors)[0];
            res.status(400).send({
                message: err.errors[key].message,
            });
        });

};

exports.find = async(req, res) => {
    let data = req.subject;
    const timeline = await data.timelines.find(value => value._id == req.query.idTimeline || req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
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
            message: "Not found assignment",
        });
    }
    if (req.user.idPrivilege === 'student') {
        let submission = assignment.submission.find(value => value.idUser === req.user._id);
        console.log(submission);
        if (submission) {
            res.send({
                _id: assignment._id,
                name: assignment.name,
                content: assignment.content,
                submissionStatus: true,
                gradeStatus: submission.feedBack ? true : false,
                setting: assignment.setting,
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
                submission: null
            });
        }
    } else {
        let submissions = await Promise.all(assignment.submission
            .map(async function(submit) {
                var student = await User.findById(submit.idUser, 'firstName surName urlAvatar')
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
            submissionCount: assignment.submission.length,
            submission: submissions
        });
    }
};

exports.findAll = async(req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
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
        return res.status(400).send({ message: 'Thiếu dữ liệu' });
    }

    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({ message: 'Not found assignment' });
    }

    assignment.name = data.name;
    assignment.content = data.content;
    assignment.setting = {
        startTime: data.setting.startTime,
        expireTime: data.setting.expireTime,
        isOverDue: data.setting.isOverDue,
        overDueDate: data.setting.overDueDate,
        fileCount: data.setting.fileCount,
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
            const key = Object.keys(err.errors)[0];
            res.status(500).send({
                message: err.errors[key].message,
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

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    // const indexAssignment = timeline.assignments.indexOf(assignment);
    if (!assignment) {
        return res.status(404).send({
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
        cb(null, file.originalname)
    }
});

exports.submit = (req, res) => {
    let data = req.subject;
    console.log(req.body);
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({
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
                fileSize: setting.fileSize * 1020 * 1024,
                fileCount: setting.fileCount
            }
        }).single('file');
        upload(req, res, function(err) {
            if (err) {
                return res.end("Error uploading file.");
            }
            console.log(req.file);
            const files = [];
            let file = {
                name: req.file.name,
                link: req.file.path,
                type: req.file.path.split('.').pop(),
                uploadDay: Date.now()
            }
            files.push(file);
            var index = 0;
            var submitted = assignment.submission.find(value => value.idUser === req.idStudent);
            if (submitted) {
                index = assignment.submission.indexOf(submitted);
                submitted.submitTime = today;
                submitted.file = files;
            } else {
                var submission = {
                    idUser: req.idStudent,
                    submitTime: today,
                    file: files
                }
                index = assignment.submission.push(submission) - 1;
            }

            data.save()
                .then(() => {
                    res.send(assignment.submission[index]);
                })
                .catch((err) => {
                    const key = Object.keys(err.errors)[0];
                    res.status(500).send({
                        message: err.errors[key].message,
                    });
                });
        });

    } else {
        let message = "";
        if (today <= setting.startTime) {
            message = "Chưa tới thời gian nộp bài!";
        } else {
            message = "Đã quá thời hạn nộp bài!"
        }
        res.status(500).send({ message: message });
    }
};

exports.download = (req, res) => {
    let data = req.subject;
    console.log(req);
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({
            message: "Not found assignment",
        });
    }

    if (req.idPrivilege === 'student') {
        var submission = assignment.submission.find(value => value.idStudent === req.user._id);
        if (!submission) {
            return res.status(404).send({
                message: "Not found submission",
            });
        }
        let file = submission.files.find(value => value._id == req.query.file);
        if (!file) {
            return res.status(404).send({
                message: "Not found file",
            });
        }
        res.download(file.link);
    } else {
        var submission = assignment.submission.find(value => value.idStudent === req.query.idStudent);
        if (!submission) {
            return res.status(404).send({
                message: "Not found submission",
            });
        }
        let file = submission.files.find(value => value._id == req.query.file);
        if (!file) {
            return res.status(404).send({
                message: "Not found file",
            });
        }
        res.download(file.link);
    }

}

exports.gradeSubmission = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    if (!assignment) {
        return res.status(404).send({
            message: "Not found assignment",
        });
    }

    var submitted = assignment.submission.find(value => value._id == req.params.idSubmission);
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
                const key = Object.keys(err.errors)[0];
                res.status(400).send({
                    message: err.errors[key].message,
                });
            });
    } else {
        res.status(404).send("Not found submission!")
    }
}