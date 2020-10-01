var express = require('express');
var router = express.Router();

/* ROUTER FOR PRIVILEGE */
const subjectController = require("../controllers/subjectController")
const timelineController = require("../controllers/timelineController")
router.get('/', subjectController.findAll);
router.post('/', subjectController.create);

router.post('/timeLine/createTimeLine/:idSubject', timelineController.create);
router.get('/timeLine/:idSubject', timelineController.findAll);
router.get('/timeLine/find/:idSubject/:idTimeline', timelineController.find);
router.put('/timeLine/update/:idSubject/:idTimeline', timelineController.update);
router.delete('/timeLine/delete/:idSubject/:idTimeline', timelineController.delete);

module.exports = router;