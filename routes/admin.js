const router = require("express").Router();
const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/is-auth");

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.get(
  "/delete-product/:productId",
  isAuth,
  adminController.getDeleteProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
