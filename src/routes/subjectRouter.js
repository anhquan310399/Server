var express = require('express');
var router = express.Router();

/* ROUTER FOR PRIVILEGE */
const subjectController = require("../controllers/subjectController")
const timelineController = require("../controllers/timelineController")
const informationController = require("../controllers/informationController")
router.get('/', subjectController.findAll);
router.get('/:idSubject', subjectController.find);
router.post('/create', subjectController.create);
router.put('/:idSubject/update', subjectController.update);
router.delete('/:idSubject/delete', subjectController.delete);

/**time line */
router.post('/:idSubject/timeline/create', timelineController.create);
router.get('/:idSubject/timeline', timelineController.findAll);
router.get('/:idSubject/timeline/:idTimeline', timelineController.find);
router.put('/:idSubject/timeline/:idTimeline/update', timelineController.update);
router.delete('/:idSubject/timeline/:idTimeline/delete', timelineController.delete);

/** information */
router.get('/:idSubject/timeline/:idTimeline/information', informationController.findAll);
router.post('/:idSubject/timeline/:idTimeline/information/create', informationController.create);
router.get('/:idSubject/timeline/:idTimeline/information/:idInformation', informationController.find);
router.put('/:idSubject/timeline/:idTimeline/information/:idInformation/update', informationController.update);
router.delete('/:idSubject/timeline/:idTimeline/information/:idInformation/delete', informationController.delete);
module.exports = router;