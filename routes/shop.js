const router = require("express").Router();
const shopController = require("../controllers/shopController");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

router.get("/", shopController.getHomePage);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
