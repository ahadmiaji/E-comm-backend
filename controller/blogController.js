const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asynHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const blogModel = require("../models/blogModel");
const cloudinaryUploadingImg = require("../utils/cloudinary");
const fs = require("fs");


const createBlog = asynHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlog = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getBlog = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");

        const updateViews = await Blog.findByIdAndUpdate(id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        );

        return res.json({ status: true, statusCode: 200, data: getBlog });

    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlogs = asynHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlog = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const likedBlog = asynHandler(async (req, res) => {

    const { blogId } = req.body;
    validateMongoDbId(blogId);

    //find the blog which you want to be liked    
    const blog = await Blog.findById(blogId);
    //find the login user
    const loginUserId = req?.user?._id;
    //find if the user has liked that
    const isLiked = blog.isLiked;
    //find the user if he has disliked the post

    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },
            { new: true }
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true,
        },
            { new: true }
        );
        res.json(blog);
    }
});

const dislikedBlog = asynHandler(async (req, res) => {

    const { blogId } = req.body;
    validateMongoDbId(blogId);

    //find the blog which you want to be liked    
    const blog = await Blog.findById(blogId);
    //find the login user
    const loginUserId = req?.user?._id;
    //find if the user has liked that
    const isDisLiked = blog?.isDisliked;
    // console.log(isDisLiked);
    //find the user if he has disliked the post

    const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        },
            { new: true }
        );
        res.json(blog);
    }
    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },
            { new: true }
        );
        res.json(blog);
    } else {
        // console.log("blogId: ", blogId);
        const blog = await Blog.findByIdAndUpdate(blogId, {
            //$push: { dislikes: loginUserId },
            isDisliked: true,
        },
            { new: true }
        );
        res.json(blog);
    }
});

const uploadImages = asynHandler(async (req, res) => {
    // console.log(req.files);
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const uploader = (path) => cloudinaryUploadingImg(path, "images");
        const urls = [];
        const files = req.files;

        for (const file of files) {

            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            fs.unlinkSync(path);
        }

        console.log(urls);

        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            }),
        },
            {
                new: true,
            }
        );

        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likedBlog, dislikedBlog, uploadImages };