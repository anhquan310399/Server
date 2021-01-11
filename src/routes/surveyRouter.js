var express = require('express');
var router = express.Router();
const { authInSubject, authLecture, authStudent } = require("../middleware/auth")

const surveyController = require('../controllers/surveyController');

router.post('/', authLecture, surveyController.create);
router.get('/', authLecture, surveyController.findAll);
router.get('/:idSurvey', authInSubject, surveyController.find);
router.get('/:idSurvey/update', authLecture, surveyController.findUpdate);
router.put('/:idSurvey', authLecture, surveyController.update);
router.put('/:idSurvey/hide', authLecture, surveyController.hideOrUnhide);
router.delete('/:idSurvey/', authLecture, surveyController.delete);

router.get('/:idSurvey/attempt', authStudent, surveyController.attemptSurvey);
router.post('/:idSurvey/submit', authStudent, surveyController.replySurvey);
router.get('/:idSurvey/view', authStudent, surveyController.viewResponse);
router.get('/:idSurvey/responses', authInSubject, surveyController.viewAllResponse);

module.exports = router