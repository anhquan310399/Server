var express = require('express');
var router = express.Router();
const { authLogin, authInSubject, authLecture, authAdmin, authStudent } = require("../middleware/auth")
    /* ROUTER FOR  SUBJECT */
const subjectController = require("../controllers/subjectController")


router.get('/', authLogin, subjectController.findAll);
router.get('/deadline', authLogin, subjectController.getDeadline);
router.get('/:idSubject/deadline', authStudent, subjectController.getDeadlineBySubject);
router.get('/:idSubject', authInSubject, subjectController.find);
router.get('/:idSubject/detail', authAdmin, subjectController.findByAdmin);
router.get('/:idSubject/export', authAdmin, subjectController.exportSubject);
router.get('/:idSubject/export-teacher/quiz', authLecture, subjectController.exportQuizBank);
router.get('/:idSubject/export-teacher/survey', authLecture, subjectController.exportSurveyBank);
router.get('/:idSubject/export-teacher', authLecture, subjectController.exportSubject);
router.post('/:idSubject/import-teacher', authLecture, subjectController.importSubject);
router.post('/', authAdmin, subjectController.create);
router.put('/:idSubject/', authAdmin, subjectController.update);
router.put('/:idSubject/hide', authAdmin, subjectController.hideOrUnhide);

router.get('/:idSubject/students', authInSubject, subjectController.getListStudent);
router.post('/:idSubject/add-student', authLecture, subjectController.addStudent);
router.delete('/:idSubject/remove-student/', authLecture, subjectController.removeStudent);

router.delete('/:idSubject/', authAdmin, subjectController.delete);
// router.post('/:idSubject/add-list-student', subjectController.addAllStudents);

router.get('/:idSubject/index', authLecture, subjectController.getOrderOfTimeLine);
router.post('/:idSubject/index', authLecture, subjectController.adjustOrderOfTimeline);


router.get('/:idSubject/score', authInSubject, subjectController.getSubjectTranscript);
router.get('/:idSubject/transcript', authLecture, subjectController.getSubjectTranscriptTotal);

router.put('/:idSubject/ratio', authLecture, subjectController.updateRatioTranscript);


module.exports = router;