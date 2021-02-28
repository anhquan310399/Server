var express = require('express');
var router = express.Router();
var { authInSubject, authLecture, authStudent } = require("../middleware/auth")
/* ROUTER FOR PRIVILEGE */
var timelineController = require("../controllers/timelineController")

router.post('/', authLecture, timelineController.create);
router.get('/', authLecture, timelineController.findAll);
router.get('/:idTimeline', authLecture, timelineController.find);
router.put('/:idTimeline/', authLecture, timelineController.update);
router.put('/:idTimeline/hide', authLecture, timelineController.hideOrUnHide);


// router.post('/:idTimeline/upload', authLecture, timelineController.uploadFile);

router.post('/upload', authLecture, timelineController.uploadFile);

// router.get('/:idTimeline/download/:idFile', authInSubject, timelineController.downloadFile);
router.delete('/:idTimeline/remove/:idFile', authLecture, timelineController.removeFile);
router.get('/:idTimeline/files/:idFile', authLecture, timelineController.getFile);
router.put('/:idTimeline/files/:idFile', authLecture, timelineController.updateFile);
module.exports = router;