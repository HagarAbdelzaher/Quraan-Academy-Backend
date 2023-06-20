const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: {
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

userSchema.pre('save', function preSave(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.verfiyPassword = function verfiyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre('findOneAndUpdate', function preUpdate(next) {
  this._update.password = bcrypt.hashSync(this._update.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
