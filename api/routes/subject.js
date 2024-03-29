const router = require("express").Router();
const {
	registerSubjectByCategory,
	postSubjectByCategory,
	searchSubjectByNameSorted,
	updateCategory,
	updateRegisteredSubject,
	updateSubjectByCategoryById,
	getSubjectByCategoryById,
	getRegisteredSubject,
	getAllTutorByCategory,
	getAllSubjectByCategory,
	getAllCategories,
	getAll,
	deleteCategory,
	deleteSubjectByCategoryById,
	deleteRegisteredSubject,
} = require("../controllers/subject");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const tutorAuth = require("../middleware/adminAuth");

router.route("/").get(getAll);

router.route("/search").get(searchSubjectByNameSorted); //

router.route("/categories").get(getAllCategories);

router
	.route("/:category")
	.post(postSubjectByCategory)
	.get(getAllSubjectByCategory)
	.delete(auth, deleteCategory) //
	.put(auth, updateCategory);

router
	.route("/:category/tutor")
	.post(auth, registerSubjectByCategory)
	.get(auth, getRegisteredSubject)
	.put(auth, updateRegisteredSubject)
	.delete(auth, deleteRegisteredSubject); //

router.route("/:category/student").get(getAllTutorByCategory); //

router
	.route("/:category/:id")
	.get(getSubjectByCategoryById)
	.put(updateSubjectByCategoryById)
	.delete(deleteSubjectByCategoryById);

module.exports = router;
