const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },

  currency: {
    type: String,
    default: "INR",
    enum: ["INR", "USD", "AED"],
  },

  price: {
    type: Number,
    min: 0,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "must be integer value",
    },
  },

  cost: {
    type: Number,
    min: 0,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "must be integer value",
    },
  },

  // trial: {
  //   applicable: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   period: {
  //     type: Number,
  //     default: 7,
  //   },
  // },

  billed: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true,
    trim: true,
  },

  // isGlobal: {
  //   type: Boolean,
  //   default: false,
  // },

  // isPushed: {
  //   type: Boolean,
  //   default: false,
  // },

  // isActive: {
  //   type: Boolean,
  //   default: true,
  // },

  // employeeLimit: {
  //   type: Number,
  //   min: 1,
  //   required: true,
  //   validate: {
  //     validator: Number.isInteger,
  //     message: "must be integer value",
  //   },
  // },

  bayut: {
    type: Boolean,
    default: false,
  },

  propertyfinder: {
    type: Boolean,
    default: false,
  },

  dubaidubizzle: {
    type: Boolean,
    default: false,
  },

  emiratesauction: {
    type: Boolean,
    default: false,
  },
});

const Plan = new mongoose.model("Plan", planSchema);

module.exports = Plan;
