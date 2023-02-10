const express = require("express");
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand } = require("../controller/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();


router.get("/", getAllBrand);
router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getBrand);
module.exports = router;