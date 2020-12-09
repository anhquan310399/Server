const isToday = require('../common/isToday');

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
        content: req.body.data.content
    };

    var length = timeline.information.push(model);

    data.save()
        .then(() => {
            let information = timeline.information[length - 1];
            res.send({
                _id: information._id,
                name: information.name,
                content: information.content,
                time: information.createdAt,
                isNew: true
            });
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
    const timeline = data.timelines.find(value => value._id == req.query.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }

    const information = timeline.information.find(value => value._id == req.params.idInformation);

    if (information) {
        return res.send({
            _id: information._id,
            name: information.name,
            content: information.content,
            time: information.createdAt,
            isNew: isToday(information.updatedAt)
        });
    } else {
        return res.status(404).send({
            message: "Not found information",
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
    var information = await Promise.all(timeline.information.map(async(value) => {
        return {
            _id: value._id,
            name: value.name,
            content: value.content,
            time: value.createdAt,
            isNew: isToday(value.updatedAt)
        };
    }));
    res.send(information);
};

exports.update = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.body.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline",
        });
    }
    const information = timeline.information.find(function(value, index, arr) {
        return (value._id == req.params.idInformation)
    });
    if (!information) {
        return res.status(404).send({
            message: "Not found information",
        });
    }

    information.name = req.body.data.name;
    information.content = req.body.data.content;
    data.save()
        .then(() => {
            res.send({
                _id: information._id,
                name: information.name,
                content: information.content,
                time: information.createdAt,
                isNew: isToday(information.updatedAt)
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
    const information = timeline.information.find(value => value._id == req.params.idInformation);
    const indexInfo = timeline.information.indexOf(information);
    if (indexInfo === -1) {
        return res.status(404).send({
            message: "Not found information",
        });
    }

    timeline.information.splice(indexInfo, 1);

    data.save()
        .then(() => {
            res.send({ message: "Delete successfully!" });
        })
        .catch((err) => {
            console.log("Delete information: " + err.message);
            res.status(500).send({
                message: "Delete failure!"
            });
        });
};