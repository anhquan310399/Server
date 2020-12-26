var express = require('express');
var router = express.Router();
var { authAdmin } = require('../middleware/auth');
/* ROUTER FOR PRIVILEGE */
const privilegeController = require("../controllers/privilegeController")

router.get('/:id', authAdmin, privilegeController.findPrivilege);

router.get('/', authAdmin, privilegeController.findAll);

router.post('/', authAdmin, privilegeController.create);

router.put('/:id', authAdmin, privilegeController.update);

router.delete('/:id', authAdmin, privilegeController.delete);


module.exports = router;