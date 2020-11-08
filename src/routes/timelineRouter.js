var express = require('express');
var router = express.Router();
const { authInSubject, authLecture } = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const timelineController = require("../controllers/timelineController")

router.post('/', authLecture, timelineController.create);
router.get('/', authInSubject, timelineController.findAll);
router.get('/:idTimeline', authInSubject, timelineController.find);
router.put('/idTimeline/', authLecture, timelineController.update);
router.delete('/:idTimeline/', authLecture, timelineController.delete);

module.exports = router;