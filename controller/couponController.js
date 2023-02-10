const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req, res) => {
    try {
        // if (req.body.title) {
        //     req.body.slug = slugify(req.body.title);
        // }
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }

});

const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const getAllCoupon = await Coupon.find();
        res.json(getAllCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        // res.json(updateCoupon);
        return res.json({ status: true, statusCode: 200, data: updateCoupon });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        return res.json({ status: true, statusCode: 200, data: deleteCoupon });
    } catch (error) {
        throw new Error(error);
    }
});

const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getCoupon = await Coupon.findById(id);

        return res.json({ status: true, statusCode: 200, data: getCoupon });

    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon, getCoupon };


// https://www.youtube.com/watch?v=S6Yd5cPtXr4&list=PL0g02APOH8olUaSJUReizC6KQXTrGYNU6 timestamps 6.30min/hr coupon model route controller