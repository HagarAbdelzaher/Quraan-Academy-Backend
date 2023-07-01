const { BaseError } = require("../libs");
const { Category, Question, RecordedCourses } = require("../models");

const addCategory = async (name, type) => {
    const existingRecord = await Category.findOne({ name, type });
    if (existingRecord) throw new BaseError(`category with the same name for ${type} already exists`, 400);
    const category = await Category.create({ name, type });
    if (!category) {
        throw new BaseError('failed to create category!', 400);
    }
    return category;
};

const getCategoryDetails = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new BaseError("Category not Found", 404);
    }
    return category;
}

const getAllCategories = async (page, limit, type) => {
    let query = {}
    if (type) query.type = type;
    const categories = await Category.paginate(query, {
        page: page,
        limit: limit,
        sort: { 'createdAt': -1 },
    });
    return categories;
}
const getUnpaginated = async (type) => {
    let query = {}
    if (type) query.type = type;
    const categories = await Category.find(query).sort({ 'createdAt': -1 })
    return categories;
}
const deleteCategory = async (id) => {

    const category = await Category.findById(id);

    if (!category) throw new BaseError("category doesn't exist!", 404);

    if (category.type === 'question') {
        const question = await Question.findOne({ categoryID: id })
        if (question)
            throw new BaseError("Cannot delete category with associated questions", 409);
    }

    if (category.type === 'recordedCourse') {
        const course = await RecordedCourses.findOne({ category: id });
        if (course)
            throw new BaseError("Cannot delete category with associated courses", 409);
    }
    const deletedCategory = await Category.findByIdAndDelete(id);
    return deletedCategory;
}

const updateCategory = async (id, data) => {
    const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });
    if (!updatedCategory) {
        throw new BaseError("Can't update category", 500);
    }
    return updatedCategory;
}

module.exports = {
    addCategory,
    getCategoryDetails,
    getAllCategories,
    getUnpaginated,
    deleteCategory,
    updateCategory,
};