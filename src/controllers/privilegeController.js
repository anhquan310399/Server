const db = require("../models/privilege");

exports.create = (req, res) => {
    const data = new db({
        role: req.body.role,
        name: req.body.name
    });

    // Save Ads in the database
    data.save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            if (err.code === 11000) {
                return res.status(400).send({
                    message: `Duplicate ${Object.keys(err.keyValue).toString()}`,
                });
            }
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

exports.findAll = (req, res) => {
    db.find()
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving privilege.",
            });
        });
};

exports.findPrivilege = (req, res) => {
    db.findById(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            return res.status(500).send({
                message: "Error retrieving privilege",
            });
        });
};

exports.update = (req, res) => {
    // Find ads and update it with the request body
    db.findByIdAndUpdate(
            req.params.id, {
                role: req.body.role,
                name: req.body.name,
            }, { new: true }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            return res.status(500).send({
                message: "Error updating privilege",
            });
        });
};

exports.delete = (req, res) => {
    db.findByIdAndRemove(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send({ message: "Delete successfully!" });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            return res.status(500).send({
                message: "Could not delete privilege",
            });
        });
};