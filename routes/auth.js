const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", function (req, res) {
  authController.postLogin;
});
/*
router.post("/logout", function (req, res) {
  authController.postLogout;
});
*/

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

module.exports = router;
