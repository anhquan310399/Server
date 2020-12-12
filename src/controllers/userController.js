const dbUser = require("../models/user");

exports.create = (req, res) => {
    const user = new dbUser({
        code: req.body.code,
        idPrivilege: req.body.idPrivilege,
        emailAddress: req.body.emailAddress,
        firstName: req.body.firstName,
        surName: req.body.surName
    });
    user.save()
        .then((data) => {
            // user.generateAuthToken();
            res.send(data);
        })
        .catch((err) => {
            if (err.code === 11000) {
                return res.status(400).send({
                    message: `Duplicate ${Object.keys(err.keyValue).toString()}`,
                });
            }
            const key = Object.keys(err.errors)[0];
            console.log(err.errors[key])
            res.status(400).send({
                message: err.errors[key].message,
            });
        });
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
    dbUser.findOne({ code: req.params.id })
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            var re = {
                _id: user._id,
                code: user.code,
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
            }
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

exports.authenticate = (req, res) => {
    dbUser.findOne({ code: req.body.code })
        .then(user => {
            console.log(user);
            if (!user) {
                return res.json({
                    success: false,
                    message: 'Authentication failed. User not found'
                });
            } else {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    return res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password!'
                    });
                } else {
                    let token = user.generateAuthToken();
                    console.log(token);
                    res.json({
                        success: true,
                        message: 'Login successfully!',
                        token: token
                    })
                }
            }
        })
        .catch(err => {
            res.json({
                success: false,
                message: err.message
            })
        })
}

exports.authenticateByGoogle = (req, res) => {
    dbUser.findById(req.user._id)
        .then(user => {
            console.log(user);
            if (!user) {
                return res.json({
                    success: false,
                    message: 'Authentication failed. User not found'
                });
            } else if (user) {
                let token = user.generateAuthToken();
                console.log(token);
                res.json({
                    success: true,
                    message: 'Login successfully!',
                    token: token
                })

            }
        })
        .catch(err => {
            res.json({
                success: false,
                message: err.message
            })
        })
}