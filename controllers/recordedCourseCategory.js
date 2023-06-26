const { RecordedCourseCategory, RecordedCourses } = require("../models");
const { BaseError } = require("../libs");

const createRecordedCourseCategory = async (data) => {
    const recordedCourseCategory = await RecordedCourseCategory.create(data);
    if (!recordedCourseCategory) {
        throw new BaseError("Can't create recorded course category", 500);
    }
    return recordedCourseCategory;
}

const getAllRecordedCourseCategories = async (page, limit) => {
    const skip = (page - 1) * limit;
    const recordedCourseCategory = await RecordedCourseCategory.find().skip(skip).limit(limit);
    if (!recordedCourseCategory) {
        throw new BaseError("Can't get recorded course category", 500);
    }
    return recordedCourseCategory;
}

const getRecordedCoursesByCategory = async (categoryId, page , limit) => {
    const category = await RecordedCourseCategory.findById(categoryId);
    if (!category) {
        throw new BaseError("Category not Found", 404);
    }
    const skip = (page - 1) * limit;
    const courses = await RecordedCourses.find({ category: categoryId }).skip(skip).limit(limit);
    return courses;
}

const updateRecordedCourseCategory = async (id, data) => {
    const category = await RecordedCourseCategory.findById(id);
    if (!category) {
        throw new BaseError("Category not Found", 404);
    }
    const recordedCourseCategory = await RecordedCourseCategory.findByIdAndUpdate(id, data, { new: true });
    if (!recordedCourseCategory) {
        throw new BaseError("Can't update recorded course category", 500);
    }
    return recordedCourseCategory;
}

const deleteRecordedCourseCategory = async (id) => {
    const category = await RecordedCourseCategory.findById(id);
    if (!category) {
        throw new BaseError("Category not Found", 404);
    }
    const courses = await RecordedCourses.find({ category: id });
    if (courses.length > 0) {
        throw new BaseError("Cannot delete category with associated courses", 409);
    }
    const deletedCategory = await RecordedCourseCategory.findByIdAndDelete(id);
    return deletedCategory;
}

module.exports = {
    createRecordedCourseCategory,
    getAllRecordedCourseCategories,
    getRecordedCoursesByCategory,
    updateRecordedCourseCategory,
    deleteRecordedCourseCategory
}