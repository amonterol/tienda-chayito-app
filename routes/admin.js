const router = require("express").Router();
const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/is-auth");
const { body, check } = require("express-validator");

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isLength({ min: 6 })
      .trim()
      .withMessage("Por favor el nombre del producto"),
    body("sku")
      .isAlphanumeric()
      .isLength({ min: 6 })
      .trim()
      .withMessage("Por favor el SKU del producto"),
    body("imageUrl")
      .isURL()
      .trim()
      .withMessage("Por favor la URL del producto"),
    body("price")
      .isFloat()
      .trim()
      .withMessage("Por favor el precio del producto"),
    body("category")
      .isAlphanumeric()
      .trim()
      .withMessage("Por favor la categoría del producto"),
    body("subcategory")
      .isAlphanumeric()
      .trim()
      .withMessage("Por favor la subcategoría del producto"),
    body("description")
      .isString()
      .isLength({ min: 10, max: 200 })
      .trim()
      .withMessage("Por favor la descripción del producto"),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title")
      .trim()
      .isString()
      .isLength({ min: 6 })
      .withMessage("Por favor el nombre del producto"),
    body("sku")
      .trim()
      .isAlphanumeric()
      .isLength()
      .withMessage("Por favor el sku del producto"),
    body("imageUrl")
      .trim()
      .isURL()
      .withMessage("Por favor el URL del producto"),
    body("price")
      .trim()
      .isFloat()
      .withMessage("Por favor el precio del producto"),
    body("category")
      .trim()
      .isAlphanumeric()

      .withMessage("Por favor la categoría del producto"),
    body("subcategory")
      .trim()
      .isString()
      .withMessage("Por favor la subcategoría del producto"),
    body("description")
      .trim()
      .isString()
      .isLength({ min: 10, max: 200 })
      .withMessage("Por favor la descripción del producto"),
  ],
  isAuth,
  adminController.postEditProduct
);

router.get(
  "/delete-product/:productId",
  isAuth,
  adminController.getDeleteProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
