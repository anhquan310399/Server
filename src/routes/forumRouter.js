var express = require('express');
var router = express.Router();
const { authInSubject, authLecture } = require("../middleware/auth")

const forumController = require("../controllers/forumController")

/** forum */
router.get('/', authInSubject, forumController.findAll);
router.post('/', authLecture, forumController.create);
router.get('/:idForum', authInSubject, forumController.find);
router.put('/:idForum', authLecture, forumController.update);
router.delete('/:idForum', authLecture, forumController.delete);

module.exports = router;