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

/**time line */
router.post('/:idSubject/timeline/', timelineController.create);
router.get('/:idSubject/timeline', timelineController.findAll);
router.get('/:idSubject/timeline/:idTimeline', timelineController.find);
router.put('/:idSubject/timeline/:idTimeline/', timelineController.update);
router.delete('/:idSubject/timeline/:idTimeline/', timelineController.delete);

/** information */
router.get('/:idSubject/timeline/:idTimeline/information', informationController.findAll);
router.post('/:idSubject/timeline/:idTimeline/information/', informationController.create);
router.get('/:idSubject/timeline/:idTimeline/information/:idInformation', informationController.find);
router.put('/:idSubject/timeline/:idTimeline/information/:idInformation/', informationController.update);
router.delete('/:idSubject/timeline/:idTimeline/information/:idInformation/', informationController.delete);

/** forum */
router.get('/:idSubject/timeline/:idTimeline/forum', forumController.findAll);
router.post('/:idSubject/timeline/:idTimeline/forum/', forumController.create);
router.get('/:idSubject/timeline/:idTimeline/forum/:idForum', forumController.find);
router.put('/:idSubject/timeline/:idTimeline/forum/:idForum/', forumController.update);
router.delete('/:idSubject/timeline/:idTimeline/forum/:idForum/', forumController.delete);
/** discussion */
router.get('/:idSubject/timeline/:idTimeline/forum/:idForum/discussion', discussionController.findAll);
router.post('/:idSubject/timeline/:idTimeline/forum/:idForum/discussion', auth, discussionController.create);
router.get('/:idSubject/timeline/:idTimeline/forum/:idForum/discussion/:idDiscussion', discussionController.find);
router.put('/:idSubject/timeline/:idTimeline/forum/:idForum/discussion/:idDiscussion', discussionController.update);
router.delete('/:idSubject/timeline/:idTimeline/forum/:idForum/discussion/:idDiscussion', discussionController.delete);

module.exports = router;