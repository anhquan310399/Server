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
            res.send({
                success: true,
                message: 'Create new user successfully!'
            });
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
            res.send({
                success: true,
                data: user
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

exports.findAllStudents = (req, res) => {
    dbUser.find({ idPrivilege: 'student' }, 'code emailAddress firstName surName urlAvatar')
        .then((user) => {
            res.send({
                success: true,
                data: user
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

exports.findAllTeachers = (req, res) => {
    dbUser.find({ idPrivilege: 'teacher' }, 'code emailAddress firstName surName urlAvatar')
        .then((user) => {
            res.send({
                success: true,
                data: user
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

exports.findUser = (req, res) => {
    dbUser.findOne({ code: req.params.code }, 'code emailAddress firstName surName urlAvatar')
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: `Not found user with code: ${req.params.code}`,
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
            res.send({
                success: true,
                user: re
            });
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
    // if (req.idPrivilege === 'admin' || req.idUser == req.params.id) {
    //     // Find ads and update it with the request body
    let user = req.user;

    user.surName = req.body.surName || user.surName;
    user.firstName = req.body.firstName || user.firstName;
    user.urlAvatar = req.body.urlAvatar || user.urlAvatar;
    user.save()
        .then(data => {
            res.send({
                success: true,
                message: `Update info successfully`,
                user: {
                    _id: data._id,
                    code: data.code,
                    emailAddress: data.emailAddress,
                    firstName: data.firstName,
                    surName: data.surName,
                    urlAvatar: data.urlAvatar,
                }
            });
        }).catch((err) => {
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

    // } else {
    //     return res.status(401).send({
    //         success: false,
    //         message: `You can't access this resource!`
    //     });
    // }
};

// exports.delete = (req, res) => {
//     dbUser.findByIdAndRemove(req.params.id)
//         .then((user) => {
//             if (!user) {
//                 return res.status(404).send({
//                     success: false,
//                     message: "Not found user",
//                 });
//             }
//             res.send({
//                 success: true,
//                 message: `Delete user with code: ${user.code} successfully!`
//             });
//         })
//         .catch((err) => {
//             if (err.kind === "ObjectId" || err.name === "NotFound") {
//                 return res.status(404).send({
//                     success: false,
//                     message: "Not found user",
//                 });
//             }
//             return res.status(500).send({
//                 success: false,
//                 message: "Could not delete user",
//             });
//         });
// };

exports.hideOrUnhide = (req, res) => {
    dbUser.findById(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "Not found user",
                });
            }
            user.isDeleted = !isDeleted;
            user.save()
                .then(data => {
                    let message;
                    if (data.isDeleted) {
                        message = `Hide user with code: ${data.code}`;
                    } else {
                        message = `Unhide user with code: ${data.code}`;
                    }
                    res.send({
                        success: true,
                        message: message,
                    });
                })

        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message,
            });
        });
};


exports.authenticate = (req, res) => {
    dbUser.findOne({ code: req.body.code, isDeleted: false })
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
                        user: {
                            _id: user._id,
                            code: user.code,
                            emailAddress: user.emailAddress,
                            firstName: user.firstName,
                            surName: user.surName,
                            urlAvatar: user.urlAvatar,
                            idPrivilege: user.idPrivilege
                        },
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
        const user = await dbUser.findOne({ emailAddress: userEmail, isDeleted: false }, 'code idPrivilege emailAddress firstName surName urlAvatar')
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
            user: {
                _id: user._id,
                code: user.code,
                emailAddress: user.emailAddress,
                firstName: user.firstName,
                surName: user.surName,
                urlAvatar: user.urlAvatar,
                idPrivilege: user.idPrivilege
            },
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
        const user = await dbUser.findOne({ facebookId: facebookId, isDeleted: false }, 'code idPrivilege emailAddress firstName surName urlAvatar')
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
            user: {
                _id: user._id,
                code: user.code,
                emailAddress: user.emailAddress,
                firstName: user.firstName,
                surName: user.surName,
                urlAvatar: user.urlAvatar,
                idPrivilege: user.idPrivilege
            },
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