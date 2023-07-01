const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
        trim: true,
    },
    type: {
        type: String,
        enum: ['question', 'recordedCourse'],
        required: true,
    }
}, {
    timestamps: true,
});
CategorySchema.plugin(mongoosePaginate);

CategorySchema.index({ name: 1, type: 1 }, { unique: true });

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
