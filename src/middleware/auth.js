const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Subject = require('../models/subject')

exports.authStudent = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, code: data.code, idPrivilege: 'student' })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        success: false,
                        message: "Please login"
                    });
                }

                var idSubject = req.params.idSubject || req.query.idSubject || req.body.idSubject;

                Subject.findOne({ _id: idSubject, 'studentIds': user.code })
                    .then((subject) => {
                        if (subject) {
                            req.subject = subject;
                            req.idStudent = user._id;
                            req.code = user.code;
                            next();
                        } else {
                            return res.status(404).send({
                                success: false,
                                message: "Not found subject that you enroll"
                            });
                        }
                    }).catch((err) => {
                        return res.status(500).send({
                            success: false,
                            message: err.message
                        });
                    });
            })
            .catch((err) => {
                return res.status(500).send({
                    success: false,
                    message: err.message || "Error when get user",
                });
            });
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Not authorized to access this resource"
        });
    }
}

exports.authLecture = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, code: data.code, idPrivilege: 'teacher' })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        success: false,
                        message: "Please login"
                    });
                }

                var idSubject = req.params.idSubject || req.query.idSubject || req.body.idSubject;

                Subject.findOne({ _id: idSubject, idLecture: user.code })
                    .then((subject) => {
                        if (subject) {
                            req.subject = subject;
                            req.idTeacher = user._id;
                            req.code = user.code;
                            next();
                        } else {
                            return res.status(404).send({
                                success: false,
                                message: "Not found this subject"
                            });
                        }
                    }).catch((err) => {
                        return res.status(500).send({
                            success: false,
                            message: err.message
                        });
                    });
            })
            .catch((err) => {
                return res.status(500).send({
                    success: false,
                    message: err.message
                });
            });
    } catch (error) {
        res.status(401).send({ message: 'Not authorized to access this resource' })
    }
}

exports.authInSubject = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, code: data.code })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        success: false,
                        message: "Please login"
                    });
                }
                var idSubject = req.params.idSubject || req.query.idSubject || req.body.idSubject;

                if (user.idPrivilege == "student") {
                    Subject.findOne({ _id: idSubject, isDeleted: false, 'studentIds': user.code })
                        .then((subject) => {
                            if (subject) {
                                req.user = user;
                                req.subject = subject;
                                next();
                            } else {
                                return res.status(404).send({
                                    success: false,
                                    message: "Not found Subject"
                                });
                            }
                        }).catch((err) => {
                            return res.status(500).send({
                                success: false,
                                message: err.message
                            });
                        });
                } else if (user.idPrivilege == "teacher") {
                    Subject.findOne({ _id: idSubject, isDeleted: false, idLecture: user.code })
                        .then((subject) => {
                            if (subject) {
                                req.user = user;
                                req.subject = subject;
                                next();
                            } else {
                                return res.status(404).send({
                                    success: false,
                                    message: "Not found Subject"
                                });
                            }
                        }).catch((err) => {
                            return res.status(500).send({
                                success: false,
                                message: err.message
                            });
                        });
                }
            })
            .catch((err) => {
                return res.status(500).send({
                    message: err.message,
                });
            });
    } catch (error) {
        res.status(401).send({ message: 'Not authorized to access this resource' })
    }
}

exports.authLogin = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, code: data.code })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        success: false,
                        message: "Please login"
                    });
                }
                req.idUser = user._id;
                req.code = user.code;
                req.idPrivilege = user.idPrivilege;
                req.user = user;
                next();
            })
            .catch((err) => {
                return res.status(500).send({
                    success: false,
                    message: err.message,
                });
            });
    } catch (error) {
        res.status(401).send({
            success: false,
            message: 'Not authorized to access this resource'
        })
    }
}