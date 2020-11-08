var express = require('express');
var router = express.Router();
const { authInSubject, authLecture } = require("../middleware/auth")

const examController = require("../controllers/examController")

/** forum */
router.get('/', authInSubject, examController.findAll);
router.post('/', authLecture, examController.create);
router.get('/:idExam', authInSubject, examController.find);
router.put('/:idExam', authLecture, examController.update);
router.delete('/:idExam', authLecture, examController.delete);

module.exports = router;