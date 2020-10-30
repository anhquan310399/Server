var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")

const examController = require("../controllers/examController")

/** forum */
router.get('/', examController.findAll);
router.post('/', examController.create);
router.get('/:idExam', examController.find);
router.put('/:idExam', examController.update);
router.delete('/:idExam', examController.delete);

module.exports = router;