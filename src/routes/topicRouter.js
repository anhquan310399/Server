var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")

const topicController = require("../controllers/topicController")

/** discussion */
router.get('/', topicController.findAll);
router.post('/', auth, topicController.create);
router.get('/:idDiscussion', topicController.find);
router.put('/:idDiscussion', topicController.update);
router.delete('/:idDiscussion', topicController.delete);

module.exports = router;