var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const subjectController = require("../controllers/subjectController")
const timelineController = require("../controllers/timelineController")
const informationController = require("../controllers/informationController")
const forumController = require("../controllers/forumController")
const discussionController = require("../controllers/discussionController")

router.get('/', subjectController.findAll);
router.get('/:idSubject', subjectController.find);
router.post('/', subjectController.create);
router.put('/:idSubject/', subjectController.update);
router.delete('/:idSubject/', subjectController.delete);
router.put('/:idSubject/students', subjectController.addAllStudents);

module.exports = router;