exports.create = (req, res) => {
    let data = req.subject;

    const model = {
        name: req.body.data.name,
        description: req.body.data.description,
        index: data.timelines.length + 1
    };

    var length = data.timelines.push(model);
    data.save()
        .then((data) => {
            res.send(data.timelines[length - 1]);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

// exports.findAll = (req, res) => {
//     let data = req.subject;
//     if (req.idPrivilege === 'student') {
//         res.send(data.timelines.map((value) => {
//             let forums = value.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description } });
//             let exams = value.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description } });
//             let information = value.information.map((info) => { return { _id: info._id, name: info.name, description: info.description, content: info.content } });
//             let assignments = value.assignments.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description } });
//             return { name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments };
//         }));

//     } else {
//         res.send(data.timelines.map((value) => {
//             let forums = value.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description } });
//             let exams = value.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description } });
//             let information = value.information.map((info) => { return { _id: info._id, name: info.name, description: info.description, content: info.content } });
//             let assignments = value.assignments.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description } });
//             return {
//                 _id: value._id,
//                 name: value.name,
//                 description: value.description,
//                 forums: forums,
//                 exams: exams,
//                 information: information,
//                 assignments: assignments,
//                 isDeleted: value.isDeleted
//             };
//         }));
//     }
// };

// exports.find = (req, res) => {
//     let timelines = req.subject.timelines;
//     if (req.idPrivilege === 'student') {
//         timelines.filter((value) => { if (value.isDeleted === false) return true });
//     }
//     let result = timelines.map((value) => {
//         let forums = value.forums.map((forum) => { return { _id: forum.id, name: forum.name, description: forum.description } });
//         let exams = value.exams.map((exam) => { return { _id: exam._id, name: exam.name, description: exam.description } });
//         let information = value.information.map((info) => { return { _id: info._id, name: info.name, description: info.description, content: info.content } });
//         let assignments = value.assignments.map((assign) => { return { _id: assign._id, name: assign.name, description: assign.description } });
//         if (req.idPrivilege === 'student') {
//             return { id: value._id, name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments };
//         } else {
//             return { id: value._id, name: value.name, description: value.description, forums: forums, exams: exams, information: information, assignments: assignments, isDeleted: value.isDeleted };
//         }
//     });
//     res.send(result);
// };

exports.update = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(function(value, index, arr) {
        if (value._id == req.params.idTimeline) {
            arr[index].name = req.body.data.name;
            arr[index].description = req.body.data.description;
            return true;
        } else {
            return false;
        }
    });
    data.save()
        .then((data) => {
            res.send(timeline);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};

exports.delete = (req, res) => {
    let data = req.subject;
    const timeline = data.timelines.find(value => value._id == req.params.idTimeline);
    if (!timeline) {
        return res.status(404).send({
            message: "Not found timeline"
        })
    }
    timeline.isDeleted = true;
    data.save()
        .then((data) => {
            res.send(data.timelines);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};