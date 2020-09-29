var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")

/* ROUTER FOR USER */
const userController = require("../controllers/userController.js")

router.get('/:id', auth, userController.findUser);

router.get('/', userController.findAll);

router.post('/', userController.create);

router.put('/:id', auth, userController.update);

router.delete('/:id', userController.delete);

module.exports = router;