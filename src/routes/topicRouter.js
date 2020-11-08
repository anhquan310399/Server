var express = require('express');
var router = express.Router();
const { authInSubject } = require("../middleware/auth")

const topicController = require("../controllers/topicController")

/** discussion */
router.get('/', authInSubject, topicController.findAll);
router.post('/', authInSubject, topicController.create);
router.get('/:idTopic', authInSubject, topicController.find);
router.put('/:idTopic', authInSubject, topicController.update);
router.delete('/:idTopic', authInSubject, topicController.delete);

module.exports = router;