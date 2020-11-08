var express = require('express');
var router = express.Router();
const { authLogin, authInSubject } = require("../middleware/auth")
    /* ROUTER FOR PRIVILEGE */
const subjectController = require("../controllers/subjectController")

router.get('/', authLogin, subjectController.findAll);
router.get('/:idSubject', authInSubject, subjectController.find);
router.post('/', subjectController.create);
router.put('/:idSubject/', subjectController.update);
router.delete('/:idSubject/', subjectController.delete);
router.put('/:idSubject/students', subjectController.addAllStudents);

module.exports = router;