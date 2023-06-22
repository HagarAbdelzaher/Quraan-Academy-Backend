/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const adminSchema = new Schema(
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

adminSchema.pre('save', function preSave(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

adminSchema.methods.verfiyPassword = function verfiyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

adminSchema.pre('findOneAndUpdate', function preUpdate(next) {
  this._update.password = bcrypt.hashSync(this._update.password, 10);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
