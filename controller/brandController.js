const Brand = require("../models/brandModel");
const asynHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asynHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBrand = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBrand = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const getBrand = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBrand = await Brand.findById(id);

        return res.json({ status: true, statusCode: 200, data: getBrand });

    } catch (error) {
        throw new Error(error);
    }
});

const getAllBrand = asynHandler(async (req, res) => {
    try {
        const getAllBrand = await Brand.find();
        return res.json({ status: true, statusCode: 200, data: getAllBrand });
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand };