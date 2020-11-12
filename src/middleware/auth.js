const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Subject = require('../models/subject')

exports.authStudent = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, idPrivilege: 'student', 'tokens.token': token })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({
                        message: "Please login"
                    });
                }

                var idSubject = req.params.idSubject != null ? req.params.idSubject : req.body.idSubject;

                Subject.findOne({ _id: idSubject, 'studentIds': user._id })
                    .then((subject) => {
                        if (subject) {
                            req.subject = subject;
                            req.idStudent = user._id;
                            next();
                        } else {
                            throw 'Not found Subject'
                        }
                    }).catch((err) => {
                        return res.status(401).send({
                            message: "Not authorized to access this resource"
                        });
                    });
            })
            .catch((err) => {
                return res.status(401).send({
                    message: "Not authorized to access this resource",
                });
            });
    } catch (error) {
        res.status(401).send({ message: 'Not authorized to access this resource' })
    }
}

exports.authLecture = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, idPrivilege: 'teacher', 'tokens.token': token })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        message: "Not authorized to access this resource!"
                    });
                }

                var idSubject = req.params.idSubject != null ? req.params.idSubject : req.body.idSubject;

                Subject.findOne({ _id: idSubject, lectureId: user._id })
                    .then((subject) => {
                        if (subject) {
                            req.subject = subject;
                            req.idTeacher = user._id;
                            next();
                        } else {
                            throw 'Not found Subject'
                        }
                    }).catch((err) => {
                        return res.status(401).send({
                            message: "Not authorized to access this resource"
                        });
                    });
            })
            .catch((err) => {
                return res.status(401).send({
                    message: "Not authorized to access this resource"
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
        User.findOne({ _id: data._id, 'tokens.token': token })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({
                        message: "Please login"
                    });
                }

                var idSubject = req.params.idSubject != null ? req.params.idSubject : req.body.idSubject;
                if (user.idPrivilege == "student") {
                    Subject.findOne({ _id: idSubject, isDeleted: false, 'studentIds': user._id })
                        .then((subject) => {
                            if (subject) {
                                req.user = user;
                                req.subject = subject;
                                next();
                            } else {
                                throw 'Not found Subject';
                            }
                        }).catch((err) => {
                            return res.status(404).send({
                                message: "Not found Subject"
                            });
                        });
                } else if (user.idPrivilege == "teacher") {
                    Subject.findOne({ _id: idSubject, isDeleted: false, lectureId: user._id })
                        .then((subject) => {
                            if (subject) {
                                req.user = user;
                                req.subject = subject;
                                next();
                            } else {
                                throw 'not found Subject';
                            }
                        }).catch((err) => {
                            return res.status(404).send({
                                message: "Not found Subject"
                            });
                        });
                }
            })
            .catch((err) => {
                return res.status(500).send({
                    message: "Error",
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
        User.findOne({ _id: data._id, 'tokens.token': token })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        message: "Please login"
                    });
                }
                req.idUser = user._id;
                req.idPrivilege = user.idPrivilege;
                next();
            })
            .catch((err) => {
                return res.status(401).send({
                    message: "Not authorized to access this resource",
                });
            });
    } catch (error) {
        res.status(401).send({ message: 'Not authorized to access this resource' })
    }
}