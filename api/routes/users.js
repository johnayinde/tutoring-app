const router = require("express").Router();
const {becomeAdmin,signin,signup} = require("../controllers/users");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const tutorAuth = require("../middleware/adminAuth");

router.post("/signin", signin);
router.post("/signup", signup);
router.get('/admin', auth, becomeAdmin);

module.exports = router;
