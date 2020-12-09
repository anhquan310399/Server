const multer = require('multer');
const fs = require('fs');

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
            res.send(data.timelines[length - 1]);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
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
    res.send(timelines);
};

exports.find = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline"
        })
    }
    res.send(timeline);
};

exports.update = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline"
        })
    }

    timeline.name = req.body.data.name;
    timeline.description = req.body.data.description;

    subject.save()
        .then((data) => {
            res.send({
                _id: timeline._id,
                name: timeline.name,
                description: timeline.description,
                isDeleted: timeline.isDeleted
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.delete = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(value => value._id == req.params.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline"
        })
    }
    timeline.isDeleted = true;
    subject.save()
        .then((data) => {
            res.send(data.timelines);
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
        let path = `${appRoot}/uploads/${subject}/${timeline}/files/`;
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

exports.uploadFile = (req, res) => {

    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline"
        })
    }

    var upload = multer({
        storage: storage,
        limits: {
            fileSize: 30 * 1020 * 1024
        }
    }).single('file');

    upload(req, res, function(err) {
        if (err) {
            return res.status(500).send({ message: "Error uploading file." });
        }
        console.log(req.file);
        let file = {
            name: req.file.originalname,
            path: req.file.path,
            type: req.file.path.split('.').pop(),
            uploadDay: Date.now()
        }
        let index = timeline.files.push(file);
        console.log(timeline.files[index - 1]);

        subject.save()
            .then(() => {
                res.send(timeline.files[index - 1]);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
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
            message: "Not found timeline"
        })
    }

    const file = timeline.files.find(value => value._id == req.params.idFile);
    if (!file) {
        return res.status(404).send({
            message: "Not found file"
        })
    }
    res.download(file.path);
}


exports.removeFile = (req, res) => {
    let subject = req.subject;
    const timeline = subject.timelines.find(function(value) {
        return (value._id == req.params.idTimeline)
    });
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline"
        })
    }

    const file = timeline.files.find(value => value._id == req.params.idFile);
    if (!file) {
        return res.status(404).send({
            message: "Not found file"
        })
    }
    let index = timeline.files.indexOf(file);
    fs.unlink(file.path, function(err) {
        if (err) {
            return res.status(404).send({
                message: err.message
            })
        }
        timeline.files.splice(index, 1);

        subject.save()
            .then(() => {
                res.send({ message: "Delete file successfully!" });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    })
}