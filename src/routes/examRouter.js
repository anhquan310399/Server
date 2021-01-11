var express = require('express');
var router = express.Router();
const { authInSubject, authLecture, authStudent } = require("../middleware/auth")

const examController = require("../controllers/examController")

/** forum */
router.get('/', authInSubject, examController.findAll);
router.post('/', authLecture, examController.create);
router.get('/:idExam', authInSubject, examController.find);
router.get('/:idExam/update', authLecture, examController.findUpdate);
router.put('/:idExam', authLecture, examController.update);
// router.delete('/:idExam', authLecture, examController.delete);
router.put('/:idExam/hide', authLecture, examController.hideOrUnhide);
router.get('/:idExam/attempt', authStudent, examController.doExam);
router.post('/:idExam/submit', authStudent, examController.submitExam);
module.exports = router;