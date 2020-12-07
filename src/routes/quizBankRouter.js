var express = require('express');
var router = express.Router();
const { authLecture } = require("../middleware/auth")
    /* ROUTER FOR QUIZ BANK */
const quizBankController = require("../controllers/quizBankController")

router.get('/', authLecture, quizBankController.findAllChapter);
router.get('/:idChapter', authLecture, quizBankController.findChapter);
router.post('/', authLecture, quizBankController.createChapter);
router.put('/:idChapter/', authLecture, quizBankController.updateChapter);
router.delete('/:idChapter/', authLecture, quizBankController.deleteChapter);

router.get('/:idChapter/question', authLecture, quizBankController.getAllQuestion);
router.post('/:idChapter/question', authLecture, quizBankController.pushQuestion);
router.get('/:idChapter/question/:idQuestion', authLecture, quizBankController.getQuestionById);
router.put('/:idChapter/question/:idQuestion', authLecture, quizBankController.updateQuestionById);
router.delete('/:idChapter/question/:idQuestion', authLecture, quizBankController.deleteQuestionById);

module.exports = router;