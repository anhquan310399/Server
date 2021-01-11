var express = require('express');
var router = express.Router();

const assignmentController = require("../controllers/assignmentController");
const { authInSubject, authLecture, authStudent } = require('../middleware/auth');

/** forum */
router.get('/:idAssignment', authInSubject, assignmentController.find);
router.get('/:idAssignment/update', authLecture, assignmentController.findUpdate);
router.get('/', authInSubject, assignmentController.findAll);
router.post('/', authLecture, assignmentController.create);
router.post('/:idAssignment/submit', authStudent, assignmentController.submit);
router.post('/:idAssignment/grade/:idSubmission', authLecture, assignmentController.gradeSubmission);
router.post('/:idAssignment/comment/', authStudent, assignmentController.commentFeedback);
router.put('/:idAssignment', authLecture, assignmentController.update);
// router.delete('/:idAssignment', authLecture, assignmentController.delete);

router.put('/:idAssignment/hide', authLecture, assignmentController.hideOrUnhide);

// router.get('/:idAssignment/download/:idSubmission', authInSubject, assignmentController.download);

// router.post('/upload', assignmentController.uploadFile);

module.exports = router;