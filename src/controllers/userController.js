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
                    success: false,
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
    dbUser.find()
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

exports.findUser = (req, res) => {
    dbUser.findOne({ code: req.params.id })
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "Not found user",
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
                    success: false,
                    message: "Cast to ObjectId failed",
                });
            }
            return res.status(500).send({
                success: false,
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
                    success: false,
                    message: "Not found user",
                });
            }
            res.send(user);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    success: false,
                    message: "Not found user",
                });
            }
            return res.status(500).send({
                success: false,
                message: "Error updating user",
            });
        });
};

exports.delete = (req, res) => {
    dbUser.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "Not found user",
                });
            }
            res.send({
                success: true,
                message: "Delete successfully!"
            });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    success: false,
                    message: "Not found user",
                });
            }
            return res.status(500).send({
                success: false,
                message: "Could not delete user",
            });
        });
};

exports.authenticate = (req, res) => {
    dbUser.findOne({ code: req.body.code })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'Authentication failed. User not found'
                });
            } else {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    return res.status(400).send({
                        success: false,
                        message: 'Authentication failed. Wrong password!'
                    });
                } else {
                    let token = user.generateAuthToken();
                    res.send({
                        success: true,
                        message: 'Login successfully!',
                        idPrivilege: user.idPrivilege,
                        type: 'authenticate',
                        token: token
                    })
                }
            }
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
}

exports.getInfo = (req, res) => {
    var user = req.user;
    var info = {
        _id: user._id,
        code: user.code,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        surName: user.surName,
        urlAvatar: user.urlAvatar
    }
    res.send(info);
}

const { verifyGoogle } = require('../authenticate/authGoogle');

exports.authenticateGoogleToken = async(req, res) => {
    const userToken = req.body.token
    verifyGoogle(userToken).then(async function(result) {
        var userEmail = result.email
        const user = await dbUser.findOne({ emailAddress: userEmail })
            .then(user => { return user });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: `Not found user ${userEmail}`
            })
        }
        const token = user.generateAuthToken();
        res.send({
            success: true,
            message: 'Login successfully!',
            idPrivilege: user.idPrivilege,
            type: 'google',
            token: token
        })
    }).catch(function(err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const { verifyFacebook } = require('../authenticate/authFacebook');

exports.authenticateFacebookToken = async(req, res) => {
    const userToken = req.body.token
    verifyFacebook(userToken).then(async function(result) {
        if (!result) {
            res.status(500).send({
                success: false,
                message: 'Error while verify facebook access token'
            })
        }
        let facebookId = result.id;
        const user = await dbUser.findOne({ facebookId: facebookId })
            .then(user => { return user });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: `Not found user with this facebook`
            })
        }
        const token = user.generateAuthToken();
        res.send({
            success: true,
            message: 'Login successfully!',
            idPrivilege: user.idPrivilege,
            type: 'facebook',
            token: token
        })
    }).catch(function(err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

exports.linkFacebookAccount = async(req, res) => {
    const userToken = req.body.token
    if (req.user.facebookId) {
        res.status(409).send({
            success: false,
            message: 'Your account has already linked facebook account!'
        })
    }
    verifyFacebook(userToken).then(async function(result) {
        if (!result) {
            res.status(500).send({
                success: false,
                message: 'Error while verify facebook access token'
            })
        }
        var facebookId = result.id;
        let fbUser = await dbUser.findOne({ facebookId: facebookId })
            .then(user => { return user });
        if (fbUser) {
            res.status(409).send({
                success: false,
                message: 'This facebook account is linked with another account!'
            })
        }

        let user = req.user
        user.facebookId = facebookId;
        user.save()
            .then(() => {
                res.send({
                    success: true,
                    message: `Link to facebook ${result.name} successfully!`
                })
            })

    }).catch(function(err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

exports.unlinkFacebookAccount = async(req, res) => {
    let user = req.user;
    if (!user.facebookId) {
        res.status(409).send({
            success: false,
            message: `Your account hasn't already linked facebook!`
        })
    }
    user.facebookId = null;
    user.save()
        .then(() => {
            res.send({
                success: true,
                message: `UnLink to facebook successfully!`
            })
        }).catch(function(err) {
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
}