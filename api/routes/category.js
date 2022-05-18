const router = require("express").Router();
const {
	getCategories,
	populateCategories,
	createCategory,
} = require("../controllers/category");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const tutorAuth = require("../middleware/adminAuth");

router.route("/").post(auth, createCategory).get(auth, getCategories);

router.get("/pop", populateCategories);

module.exports = router;
