var express = require('express');
var router = express.Router();
const { authInSubject, authLecture, authStudent } = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const timelineController = require("../controllers/timelineController")

router.post('/', authLecture, timelineController.create);
router.get('/', authLecture, timelineController.findAll);
router.get('/:idTimeline', authLecture, timelineController.find);
router.put('/:idTimeline/', authLecture, timelineController.update);
router.delete('/:idTimeline/', authLecture, timelineController.delete);


router.post('/:idTimeline/upload', authLecture, timelineController.uploadFile);
router.get('/:idTimeline/download/:idFile', authInSubject, timelineController.downloadFile);
router.delete('/:idTimeline/remove/:idFile', authLecture, timelineController.removeFile);

module.exports = router;