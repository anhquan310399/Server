var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")

const forumController = require("../controllers/forumController")

/** forum */
router.get('/', forumController.findAll);
router.post('/', forumController.create);
router.get('/:idForum', forumController.find);
router.put('/:idForum', forumController.update);
router.delete('/:idForum', forumController.delete);

module.exports = router;