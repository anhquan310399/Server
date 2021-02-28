var express = require('express');
var router = express.Router();
var { authLogin, authAdmin } = require('../middleware/auth');
/* ROUTER FOR USER */
var userController = require("../controllers/userController.js")

router.get('/info', authLogin, userController.getInfo);
router.get('/teacher', authAdmin, userController.findAllTeachers);
router.get('/student', authAdmin, userController.findAllStudents);

router.get('/:code', authAdmin, userController.findUser);

router.get('/', authAdmin, userController.findAll);

router.post('/', authAdmin, userController.create);

router.put('/:id/hide', authAdmin, userController.hideOrUnhide);

router.put('/', authLogin, userController.update);
router.put('/password', authLogin, userController.updatePassword);
// router.delete('/:id', authAdmin, userController.delete);


router.post('/authenticate', userController.authenticate);

router.post('/auth/google/', userController.authenticateGoogleToken);

router.post('/auth/facebook/', userController.authenticateFacebookToken);

router.put('/auth/facebook/link', authLogin, userController.linkFacebookAccount);

router.put('/auth/facebook/unlink', authLogin, userController.unlinkFacebookAccount);

module.exports = router;