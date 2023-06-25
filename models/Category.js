const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true,
    maxLength: 100,
  },
}, {
  timestamps: true,
});
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
