const express = require("express");

const ProductsController = require("../controllers/products");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, /*extractFile,*/ ProductsController.createProduct);

router.get("", ProductsController.getProducts);

router.delete("/:id", checkAuth, ProductsController.deleteProduct);

router.get("/:id", ProductsController.getProduct);

router.put("/:id", checkAuth, /*extractFile,*/ ProductsController.updateProduct);

module.exports = router;
