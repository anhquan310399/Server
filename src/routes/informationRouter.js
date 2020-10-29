var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const informationController = require("../controllers/informationController")

/** information */
router.get('/', informationController.findAll);
router.post('/', informationController.create);
router.get('/:idInformation', informationController.find);
router.put('/:idInformation/', informationController.update);
router.delete('/:idInformation/', informationController.delete);

module.exports = router;