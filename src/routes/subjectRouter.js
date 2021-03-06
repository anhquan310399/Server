var express = require('express');
var router = express.Router();
const { authLogin, authInSubject, authLecture } = require("../middleware/auth")
    /* ROUTER FOR  SUBJECT */
const subjectController = require("../controllers/subjectController")


router.get('/', authLogin, subjectController.findAll);
router.get('/deadline', authLogin, subjectController.getDeadline);
router.get('/:idSubject', authInSubject, subjectController.find);
router.get('/:idSubject/students', authInSubject, subjectController.getListStudent);
// router.post('/', subjectController.create);
// router.put('/:idSubject/', subjectController.update);
router.post('/:idSubject/add-student', authLecture, subjectController.addStudent);
router.delete('/:idSubject/remove-student/', authLecture, subjectController.removeStudent);
// router.delete('/:idSubject/', subjectController.delete);
// router.put('/:idSubject/add-list-student', subjectController.addAllStudents);
router.get('/:idSubject/index', authLecture, subjectController.getOrderOfTimeLine);
router.post('/:idSubject/index', authLecture, subjectController.adjustOrderOfTimeline);


router.get('/:idSubject/score', authInSubject, subjectController.getSubjectTranscript);
router.get('/:idSubject/transcript', authInSubject, subjectController.getSubjectTranscriptTotal);


module.exports = router;