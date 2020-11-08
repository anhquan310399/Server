var express = require('express');
var router = express.Router();

const assignmentController = require("../controllers/assignmentController");
const { authInSubject, authLecture, authStudent } = require('../middleware/auth');

/** forum */
router.get('/', authInSubject, assignmentController.findAll);
router.post('/', authLecture, assignmentController.create);
router.post('/:idAssignment/submit', authStudent, assignmentController.submit);
router.get('/:idAssignment', authInSubject, assignmentController.find);
router.put('/:idAssignment', authLecture, assignmentController.update);
router.delete('/:idAssignment', authLecture, assignmentController.delete);

module.exports = router;