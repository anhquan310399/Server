var express = require('express');
var router = express.Router();

/* ROUTER FOR USER */
const userController = require("../controllers/userController.js")

router.get('/:id', userController.findUser);

router.get('/', userController.findAll);

router.post('/', userController.create);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

module.exports = router;