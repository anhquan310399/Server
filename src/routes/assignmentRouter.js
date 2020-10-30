var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")

const assignmentController = require("../controllers/assignmentController")

/** forum */
router.get('/', assignmentController.findAll);
router.post('/', assignmentController.create);
router.post('/:idAssignment/submit', auth, assignmentController.submit);
router.get('/:idAssignment', assignmentController.find);
router.put('/:idAssignment', assignmentController.update);
router.delete('/:idAssignment', assignmentController.delete);

module.exports = router;