const express = require("express");
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon, getCoupon } = require("../controller/couponController");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupon);


router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);
// router.put("/", authMiddleware, );
router.get("/:id", getCoupon);

module.exports = router;