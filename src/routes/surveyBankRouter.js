var express = require('express');
var router = express.Router();
var { authLecture } = require("../middleware/auth")
    /* ROUTER FOR QUIZ BANK */
var surveyBankController = require("../controllers/surveyBankController")

router.get('/', authLecture, surveyBankController.findAllQuestionnaire);
router.get('/:idQuestionnaire', authLecture, surveyBankController.findQuestionnaire);
router.post('/', authLecture, surveyBankController.createQuestionnaire);
router.put('/:idQuestionnaire/', authLecture, surveyBankController.updateQuestionnaire);
router.delete('/:idQuestionnaire/', authLecture, surveyBankController.deleteQuestionnaire);

router.get('/:idQuestionnaire/question', authLecture, surveyBankController.getAllQuestion);
router.post('/:idQuestionnaire/question', authLecture, surveyBankController.pushQuestion);
router.get('/:idQuestionnaire/question/:idQuestion', authLecture, surveyBankController.getQuestionById);
router.put('/:idQuestionnaire/question/:idQuestion', authLecture, surveyBankController.updateQuestionById);
router.delete('/:idQuestionnaire/question/:idQuestion', authLecture, surveyBankController.deleteQuestionById);

module.exports = router;