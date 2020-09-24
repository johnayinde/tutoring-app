const router = require("express").Router();

const {
   getTutorById,
   getAllTutor_Subject,
   getAllTutors,
   registerTutorAndSubject,
   deleteTutorById } = require("../controllers/tutor");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const tutorAuth = require("../middleware/adminAuth");

router.route('/')
   .post(auth, registerTutorAndSubject)
   .get(getAllTutors);

router.get('/subject', auth, getAllTutor_Subject);
router.route('/:id')
   .get(getTutorById)
   .delete(auth, deleteTutorById);







module.exports = router;