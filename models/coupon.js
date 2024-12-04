const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },

  info: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    required: true,
    enum: ["percentage", "amount"],
  },

  value: {
    type: Number,
    required: true,
  },

  upto: {
    type: Number,
    default: 0,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  useOnce: {
    type: Boolean,
    default: false,
  },

  firstSub: {
    type: Boolean,
    default: false,
  },

  minAmount: {
    type: Number,
    default: 0,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
