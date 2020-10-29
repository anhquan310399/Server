var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")

const discussionController = require("../controllers/discussionController")

/** discussion */
router.get('/', discussionController.findAll);
router.post('/', auth, discussionController.create);
router.get('/:idDiscussion', discussionController.find);
router.put('/:idDiscussion', discussionController.update);
router.delete('/:idDiscussion', discussionController.delete);

module.exports = router;