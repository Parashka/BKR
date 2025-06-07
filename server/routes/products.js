const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById, 
} = require("../controllers/productController")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), createProduct);
router.post("/", createProduct);
router.get("/", getAllProducts);
router.put("/:id", updateProduct); 
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);


module.exports = router;
