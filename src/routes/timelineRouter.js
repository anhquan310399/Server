var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const timelineController = require("../controllers/timelineController")

router.post('/', timelineController.create);
router.get('/', timelineController.findAll);
router.get('/:idTimeline', timelineController.find);
router.put('/idTimeline/', timelineController.update);
router.delete('/:idTimeline/', timelineController.delete);

module.exports = router;