const router = require("express").Router();
const {
  getLessonById,
  getAll,
  bookLessonByStudent,
  bookLesson_admin,
  updateLessonById,
  deleteLessonById,
} = require("../controllers/lesson");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const tutorAuth = require("../middleware/adminAuth");

router.route("/").post(bookLesson_admin).get(getAll);

router.route("/student").post(auth, bookLessonByStudent);

router
  .route("/:id")
  .get(getLessonById)
  .delete(deleteLessonById)
  .patch(updateLessonById);

module.exports = router;
