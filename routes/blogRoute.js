const express = require("express");


const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likedBlog, dislikedBlog, uploadImages, } = require("../controller/blogController");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

const router = express.Router();

router.get("/", getAllBlogs);
router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 2), blogImgResize, uploadImages);

router.put("/likes", authMiddleware, likedBlog);
router.put("/dislikes", authMiddleware, dislikedBlog);

router.put("/:id", authMiddleware, isAdmin, updateBlog); //timestamps 4.31min/hr https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6 
router.get("/:id", getBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
