var express = require('express');
var router = express.Router();
const { authInSubject, authLecture } = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const informationController = require("../controllers/informationController")

/** information */
router.get('/', authInSubject, informationController.findAll);
router.post('/', authLecture, informationController.create);
router.get('/:idInformation', authInSubject, informationController.find);
router.put('/:idInformation/', authLecture, informationController.update);
router.delete('/:idInformation/', authLecture, informationController.delete);

module.exports = router;