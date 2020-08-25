const router = require("express").Router();
const userContorller = require("../controllers/users");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/signin", userContorller.signin);
router.post("/signup", userContorller.signup);
router.get('/admin', auth, userContorller.becomeAdmin);

module.exports = router;
