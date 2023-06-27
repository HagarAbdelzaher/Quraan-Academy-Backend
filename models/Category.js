const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 30,
    trim: true,
    unique: true,
  },
}, {
  timestamps: true,
});
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
