const router = require("express").Router();
const userContorller = require("../controllers/users");
const auth = require("../middleware/admin-auth");

router.post("/signin", userContorller.signin);
router.post("/signup", userContorller.signup);
router.get('/admin', userContorller.becomeAdmin)

module.exports = router;
