var express = require('express');
var router = express.Router();
const { authLogin, authInSubject, authLecture } = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const subjectController = require("../controllers/subjectController")

router.get('/', authLogin, subjectController.findAll);
router.get('/deadline', authLogin, subjectController.getDeadline);
router.get('/:idSubject', authInSubject, subjectController.find);
router.get('/:idSubject/student', authInSubject, subjectController.getListStudent);
router.post('/', subjectController.create);
router.put('/:idSubject/', subjectController.update);
router.delete('/:idSubject/', subjectController.delete);
router.put('/:idSubject/students', subjectController.addAllStudents);
router.get('/:idSubject/index', authLecture, subjectController.getOrderOfTimeLine);
router.put('/:idSubject/index', authLecture, subjectController.adjustOrderOfTimeline);
module.exports = router;