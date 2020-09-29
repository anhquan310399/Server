var express = require('express');
var router = express.Router();

/* ROUTER FOR PRIVILEGE */
const privilegeController = require("../controllers/privilegeController")

router.get('/:id', privilegeController.findPrivilege);

router.get('/', privilegeController.findAll);

router.post('/', privilegeController.create);

router.put('/:id', privilegeController.update);

router.delete('/:id', privilegeController.delete);


module.exports = router;