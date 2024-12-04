const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Plan",
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "must be integer value",
      },
    },

    users: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "must be integer value",
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "canceled",
        "processing",
        "requires_action",
        "requires_capture",
        "requires_confirmation",
        "requires_payment_method",
        "succeeded",
      ],
      default: "pending",
    },

    intent: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Payment = new mongoose.model("Payment", paymentSchema);
module.exports = Payment;
