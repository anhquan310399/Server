var express = require('express');
var router = express.Router();
const { authInSubject } = require("../middleware/auth");

const discussionController = require("../controllers/discussionController")

/** discussion */
router.get('/', authInSubject, discussionController.findAll);
router.post('/', authInSubject, discussionController.create);
router.get('/:idDiscussion', authInSubject, discussionController.find);
router.put('/:idDiscussion', authInSubject, discussionController.update);
router.delete('/:idDiscussion', authInSubject, discussionController.delete);

module.exports = router;