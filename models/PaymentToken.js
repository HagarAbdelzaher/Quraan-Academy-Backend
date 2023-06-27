const mongoose = require('mongoose');

const PaymentTokenSchema = new mongoose.Schema({
  token: {
    type: 'string',
    required: true,
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  status: {
    type: String,
    default: 'valid'
  },
}, {
  timestamps: true,
});
const PaymentToken = mongoose.model('PaymentToken', PaymentTokenSchema);
module.exports = PaymentToken;
