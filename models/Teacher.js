/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const teacherSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    password: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  },
);

teacherSchema.pre('save', function preSave(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

teacherSchema.methods.verfiyPassword = function verfiyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

teacherSchema.pre('findOneAndUpdate', function preUpdate(next) {
  this._update.password = bcrypt.hashSync(this._update.password, 10);
  next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
