const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, 'tokens.token': token })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({
                        message: "Not found",
                    });
                }
                req.userId = user._id;
                req.token = token;
                next()
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
module.exports = auth