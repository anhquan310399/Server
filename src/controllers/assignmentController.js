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
        content: req.body.data.content,
        setting: req.body.data.setting
    };

    let length = timeline.assignments.push(model);

    const setting = req.body.data.setting;
    console.log(setting.expireTime < setting.startTime);

    data.save()
        .then(() => {
            res.send(timeline.assignments[length - 1]);
        })
        .catch((err) => {
            const key = Object.keys(err.errors)[0];
            res.status(500).send({
                message: err.errors[key].message,
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
        res.send({
            _id: assignment._id,
            name: assignment.name,
            content: assignment.content,
            setting: assignment.setting,
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
            startTime: value.setting.startTime,
            expireTime: value.setting.expireTime
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
            arr[index].content = req.body.data.content || arr[index].content;
            arr[index].setting = req.body.data.setting || arr[index].setting;
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
                setting: assignment.setting,
                submission: assignment.submission.length
            });
        })
        .catch((err) => {
            const key = Object.keys(err.errors)[0];
            res.status(500).send({
                message: err.errors[key].message,
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
    const setting = assignment.setting;
    if ((today >= setting.startTime && today <= setting.expireTime) ||
        (setting.isOverDue && today <= setting.overDueDate && today >= setting.startTime)) {
        const files = req.body.data.files
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
                const key = Object.keys(err.errors)[0];
                res.status(500).send({
                    message: err.errors[key].message,
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