const dbUser = require("../models/user");

exports.create = (req, res) => {
    try {
        const user = new dbUser(req.body);
        user.save()
            .then((data) => {
                user.generateAuthToken();
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating user.",
                });
            });
    } catch (error) {
        res.status(400).send({
            message: error.message || "Some error occurred while creating user."
        });
    }
};

exports.findAll = (req, res) => {
    dbUser.find()
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

exports.findUser = (req, res) => {
    dbUser.findOne({ _id: req.params.id })
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            var re = {
                id: user._id,
                emailAddress: user.emailAddress,
                firstName: user.firstName,
                surName: user.surName,
                urlAvatar: user.urlAvatar
            }
            res.send(re);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Cast to ObjectId failed",
                });
            }
            return res.status(500).send({
                message: "Error retrieving user",
            });
        });
};

exports.update = (req, res) => {
    // Find ads and update it with the request body
    dbUser.findByIdAndUpdate(
            req.params.id, {
                firstName: req.body.firstName,
                surName: req.body.surName,
            }, { new: true }
        )
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(user);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            return res.status(500).send({
                message: "Error updating user",
            });
        });
};

exports.delete = (req, res) => {
    dbUser.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (!user) {
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
                message: "Could not delete user",
            });
        });
};