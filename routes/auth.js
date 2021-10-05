const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/authController");
const router = express.Router();

const User = require("../models/user");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Por favor ingrese un correo electrónico válido")
      .normalizeEmail(),
    body(
      "password",
      "Por favor ingrese una contraseña que solo contenga números y letras y al menos 5 caracteres"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Por favor ingrese un correo electrónico válido")

      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "El correo electrónico ya existe, por favor ingrese uno diferente!"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Por favor ingrese una contraseña que solo contenga números y letras y al menos 5 caracteres"
    )
      .isLength({ min: 5 })

      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Las contraseña nos coinciden");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get("/pwdReset", authController.getPwdReset);

router.post("/pwdReset", authController.postPwdReset);

router.get("/new-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
