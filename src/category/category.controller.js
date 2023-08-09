const mongoose = require("mongoose");
const CategoryModel = require("./category.model");
const utils = require("../../helpers/utils");

exports.GetCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        return res.json(utils.handleResponse("Categories fetched successfully", 200, categories));
    } catch (error) {
        return res.json(utils.handleResponse(error.message, 500));
    }
    }