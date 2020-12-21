// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
const isToday = require('../common/isToday');
exports.create = (req, res) => {
    let subject = req.subject;

    const model = {
        name: req.body.data.name,
        description: req.body.data.description,
        index: subject.timelines.length + 1
    };

    var length = subject.timelines.push(model);
    subject.save()
        .then((data) => {
            res.send({
                success: true,
                message: "Create timeline successfully!",
                timeline: data.timelines[length - 1]
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

exports.findAll = async(req, res) => {
    let subject = req.subject;

    let timelines = await Promise.all(subject.timelines.map(async(value) => {
        return {
            _id: value._id,
            name: value.name,
            description: value.description,
            isDeleted: value.isDeleted
        };
    }))
    res.send({
        success: true,
        timelines
    });
};

exports.find = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        })
    }

    let forums = timeline.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description, time: forum.createdAt, isNew: isToday(forum.updatedAt), isDeleted: forum.isDeleted } });
    let exams = timeline.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description, time: exam.createdAt, isNew: isToday(exam.createdAt), isDeleted: exam.isDeleted } });
    let information = timeline.information.map((info) => { return { _id: info._id, name: info.name, content: info.content, time: info.createdAt, isNew: isToday(info.updatedAt) } });
    let assignments = timeline.assignments.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description, time: assign.createdAt, isNew: isToday(assign.createdAt), isDeleted: assign.isDeleted } });

    let result = { _id: timeline._id, name: timeline.name, description: timeline.description, forums: forums, exams: exams, information: information, assignments: assignments, files: timeline.files, index: timeline.index, isDeleted: timeline.isDeleted };
    res.send({
        success: true,
        timeline: result
    });
};

exports.update = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        })
    }

    timeline.name = req.body.data.name;
    timeline.description = req.body.data.description;

    subject.save()
        .then((data) => {
            // res.send({
            //     _id: timeline._id,
            //     name: timeline.name,
            //     description: timeline.description,
            //     isDeleted: timeline.isDeleted
            // });

            res.send({
                success: true,
                message: 'Update timeline successfully!'
            })
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

exports.hideOrUnHide = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.params.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        })
    }
    timeline.isDeleted = !timeline.isDeleted;
    subject.save()
        .then(() => {
            if (timeline.isDeleted) {
                res.send({
                    success: true,
                    message: `Hide timeline ${timeline.name} successfully!`
                });
            } else {
                res.send({
                    success: true,
                    message: `Unhide timeline ${timeline.name} successfully!`
                });
            }
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
//         let timeline = req.params.idTimeline;
//         let path = `${appRoot}/uploads/${subject}/${timeline}/files/`;
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

// exports.uploadFile = (req, res) => {

//     let subject = req.subject;
//     const timeline = subject.timelines.find(function(value) {
//         return (value._id == req.params.idTimeline)
//     });
//     if (!timeline) {
//         return res.status(404).send({
//             message: "Not found timeline"
//         })
//     }

//     var upload = multer({
//         storage: storage,
//         limits: {
//             fileSize: 30 * 1020 * 1024
//         },
//         fileFilter: (req, file, cb) => {
//             let extName = path.extname(file.originalname);
//             console.log('extname : ' + extName);
//             if (extName == ".doc" || extName == ".docx" || extName == ".pdf" || extName == ".xls" || extName == ".xlsx") {
//                 cb(null, true);
//             } else {
//                 return cb(new Error('Only .doc/.docx, .pdf and .xls/.xlsx format allowed!'));
//             }
//         }
//     }).single('file');

//     upload(req, res, function(err) {
//         if (err) {
//             return res.status(500).send({ message: err.message });
//         }
//         console.log(req.file);
//         let file = {
//             name: req.file.originalname,
//             path: req.file.path,
//             type: req.file.path.split('.').pop(),
//             uploadDay: Date.now()
//         }
//         let index = timeline.files.push(file);
//         console.log(timeline.files[index - 1]);

//         subject.save()
//             .then(() => {
//                 res.send(timeline.files[index - 1]);
//             })
//             .catch(err => {
//                 res.status(500).send({
//                     message: err.message
//                 })
//             })
//     })
// }

exports.uploadFile = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.body.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        })
    }

    let file = {
        name: req.body.data.name,
        path: req.body.data.path,
        type: req.body.data.type,
        uploadDay: Date.now()
    }
    let index = timeline.files.push(file);
    console.log(timeline.files[index - 1]);

    subject.save()
        .then(() => {
            res.send({
                success: true,
                message: 'Upload file successfully!',
                file: timeline.files[index - 1]
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message
            })
        })

}

exports.downloadFile = (req, res) => {

    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        })
    }

    const file = timeline.files.find(value => value._id == req.params.idFile);
    if (!file) {
        return res.status(404).send({
            success: false,
            message: "Not found file"
        })
    }
    res.download(file.path);
}

exports.getFile = (req, res) => {

    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        })
    }

    const file = timeline.files.find(value => value._id == req.params.idFile);
    if (!file) {
        return res.status(404).send({
            success: false,
            message: "Not found file"
        })
    }
    res.send({
        success: true,
        file: file
    });
}

exports.removeFile = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            success: false,
            message: "Not found timeline"
        })
    }

    const file = timeline.files.find(value => value._id == req.params.idFile);
    if (!file) {
        return res.status(404).send({
            success: false,
            message: "Not found file"
        })
    }
    let index = timeline.files.indexOf(file);
    timeline.files.splice(index, 1);
    // fs.unlink(file.path, function(err) {
    //     if (err) {
    //         return res.status(404).send({
    //             message: err.message
    //         })
    //     }
    //     timeline.files.splice(index, 1);

    //     subject.save()
    //         .then(() => {
    //             res.send({ message: "Delete file successfully!" });
    //         })
    //         .catch(err => {
    //             res.status(500).send({
    //                 message: err.message
    //             })
    //         })
    // })

    subject.save()
        .then(() => {
            res.send({
                success: true,
                message: "Delete file successfully!"
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
}