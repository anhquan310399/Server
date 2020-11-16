const dbSubject = require("../models/subject");

exports.create = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const model = {
        name: req.body.data.name,
        description: req.body.data.description,
        content: req.body.data.content,
        startTime: new Date(req.body.data.startTime),
        expireTime: new Date(req.body.data.expireTime)
    };

    let length = timeline.assignments.push(model);

    data.save()
        .then(() => {
            res.send(timeline.assignments[length - 1]);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });

};

exports.find = (req, res) => {
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
                dueDate: assignment.expireTime,
                submission: submission
            })
        } else {
            res.send({
                _id: assignment._id,
                name: assignment.name,
                content: assignment.content,
                submissionStatus: false,
                gradeStatus: false,
                dueDate: assignment.expireTime,
                submission: null
            });
        }
    } else {
        res.send({
            _id: assignment._id,
            name: assignment.name,
            content: assignment.content,
            startTime: assignment.startTime,
            expireTime: assignment.expireTime,
            submissionCount: assignment.submission.length,
            submission: assignment.submission
        });
    }
};

exports.findAll = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    res.send(timeline.assignments.map((value) => {
        return {
            _id: value._id,
            name: value.name,
            description: value.description,
            startTime: value.startTime,
            expireTime: value.expireTime
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

    const assignment = timeline.assignments.find(function(value, index, arr) {
        if (value._id == req.params.idAssignment) {
            arr[index].name = req.body.data.name || arr[index].name;
            arr[index].description = req.body.data.description || arr[index].description;
            arr[index].content = req.body.data.content || arr[index].content;
            arr[index].startTime = req.body.data.startTime != null ? new Date(req.body.data.startTime) : arr[index].startTime;
            arr[index].expireTime = req.body.data.expireTime != null ? new Date(req.body.data.expireTime) : arr[index].expireTime;
            return true;
        } else {
            return false;
        }
    });

    data.save()
        .then(() => {
            res.send({
                _id: assignment._id,
                name: assignment.name,
                content: assignment.content,
                startTime: assignment.startTime,
                expireTime: assignment.expireTime,
                submission: assignment.submission.length
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.submit = (req, res) => {
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

    let today = Date.now();
    if (today >= assignment.startTime && today <= assignment.expireTime) {
        var submission = {
            file: {
                name: req.body.data.file.name,
                link: req.body.data.file.link,
                uploadDay: Date.now(),
                type: req.body.data.file.type
            },
            idUser: req.idStudent,
            submitTime: Date.now()
        }

        var submitted = assignment.submission.find(value => value.idUser === req.idStudent);
        if (submitted) {
            index = assignment.submission.indexOf(submitted);
            assignment.submission.splice(index, 1);
        }
        let length = assignment.submission.push(submission);

        data.save()
            .then(() => {
                res.send(assignment.submission[length - 1]);

            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message,
                });
            });
    } else {
        let message = "";
        if (today <= assignment.startTime) {
            message = "Chưa tới thời gian nộp bài!";
        } else {
            message = "Đã quá thời hạn nộp bài!"
        }
        res.status(500).send({ message: message });
    }
};

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
            grade: req.body.data.grade,
            gradeOn: Date.now(),
            gradeBy: req.idTeacher
        }

        data.save()
            .then(() => {
                res.send(submitted);

            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message,
                });
            });
    } else {
        res.status(404).send("Not found submission!")
    }
}


exports.delete = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const assignment = timeline.assignments.find(value => value._id == req.params.idAssignment);
    const indexAssignment = timeline.assignments.indexOf(assignment);
    if (indexAssignment === -1) {
        return res.status(404).send({
            message: "Not found assignment",
        });
    }


    timeline.assignments.splice(indexAssignment, 1);

    data.save()
        .then(() => {
            res.send(timeline.assignments);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};