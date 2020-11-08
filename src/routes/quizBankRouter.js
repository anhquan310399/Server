var express = require('express');
var router = express.Router();
const { authLecture } = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const quizBankController = require("../controllers/quizBankController")

router.get('/', authLecture, quizBankController.findAllChapter);
router.get('/:idChapter', authLecture, quizBankController.findChapter);
router.post('/', authLecture, quizBankController.createChapter);
router.put('/:idChapter/', authLecture, quizBankController.updateChapter);
router.delete('/:idChapter/', authLecture, quizBankController.deleteChapter);

router.get('/:idChapter', authLecture, quizBankController.getQuestion);
router.post('/:idChapter', authLecture, quizBankController.pushQuestion);
// router.put('/:idChapter/', quizBankController.updateChapter);

module.exports = router;