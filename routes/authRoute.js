const express = require("express");
const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updatedUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgetPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require("../controller/userController");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();



router.post("/register", createUser);

router.post("/forget-password-token", forgetPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus); //8.41hr/min
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/cart", authMiddleware, getUserCart);
router.post("/admin-login", loginAdmin);

router.get("/all-users", getallUser);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken);

router.get("/logout", logout);

router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress); // 7:34ht/min here we learn how to put address
router.get("/wishlist", authMiddleware, getWishlist);

router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

router.get("/:id", authMiddleware, isAdmin, getaUser)
router.delete("/empty-cart", authMiddleware, emptyCart)
router.delete("/:id", deleteaUser);



module.exports = router; //https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6&index=26   timestamp: 1.25hr/min