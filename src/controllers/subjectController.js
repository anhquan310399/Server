const db = require("../models/subject");

exports.create = (req, res) => {
    // Validate request
    const data = new db({
        _id: req.body._id,
        name: req.body.name,
        lectureId: req.body.lectureId,
        studentIds: req.body.studentIds,
        timelines: req.body.timelines
    });

    data.save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating privilege.",
            });
        });
};

exports.findAll = (req, res) => {
    var idPrivilege = req.idPrivilege;
    if (idPrivilege === 'teacher') {
        db.find({ lectureId: req.idUser, isDeleted: false })
            .then((data) => {
                var info = data.map(function(value) {
                    return { _id: value._id, name: value.name, lectureId: value.lectureId };
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
            .then((data) => {
                var info = data.map(function(value) {
                    return { _id: value._id, name: value.name, lectureId: value.lectureId };
                });
                res.send(info);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while listing subject.",
                });
            });
    }

};

exports.find = (req, res) => {
    let data = req.subject;
    let timelines = req.subject.timelines;
    if (req.idPrivilege === 'student') {
        timelines.filter((value) => { if (value.isDeleted === false) return true });
    }
    let result = {
        _id: data._id,
        name: data.name,
        lectureId: data.lectureId,
        timelines: timelines.map((value) => {
            let forums = value.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description } });
            let exams = value.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description } });
            let information = value.exams.map((info) => { return { _id: info._id, name: info.name, description: info.description, content: info.content } });
            let assignments = value.exams.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description } });
            if (req.idPrivilege === 'student') {
                return { name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments };
            } else {
                return { name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments, isDeleted: value.isDeleted };
            }
        })
    };
    res.send(result);
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Lack of information",
        });
    };
    db.findByIdAndUpdate(
            req.params.idSubject, {
                name: req.body.name == null ? data.name : req.body.name,
                lectureId: req.body.name == null ? data.lectureId : req.body.lectureId
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

exports.delete = (req, res) => {
    db.findByIdAndUpdate(
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