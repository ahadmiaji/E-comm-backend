const express = require("express");
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require("../controller/productcategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();


router.get("/", getAllCategory);
router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/:id", getCategory);
module.exports = router;