const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/pwdReset", authController.getPwdReset);

router.post("/pwdReset", authController.postPwdReset);

router.get("/new-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
