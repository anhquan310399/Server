var express = require('express');
var router = express.Router();
const { authInSubject, authLecture, authStudent } = require("../middleware/auth")

const surveyController = require('../controllers/surveyController');

router.post('/', authLecture, surveyController.create);
router.get('/', authLecture, surveyController.findAll);
router.get('/:idSurvey', authInSubject, surveyController.find);
router.put('/:idSurvey', authLecture, surveyController.update);
router.put('/:idSurvey/hide', authLecture, surveyController.hideOrUnhide);
router.delete('/:idSurvey/', authLecture, surveyController.delete);

module.exports = router