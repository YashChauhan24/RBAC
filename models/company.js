const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      match:
        /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      set: (p) => bcrypt.hashSync(p, 10),
    },

    otp: {
      code: Number,
      trys: Number,
      till: Date,
    },

    hash: {
      type: Date,
      default: 0,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    planCurrent: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Plan",
    },

    employeeLimit: {
      type: Number,
      min: 1,
      default: 3,
      validate: {
        validator: Number.isInteger,
        message: "must be integer value",
      },
    },

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

    nextRenewal: {
      type: Date,
      default: Date.now,
      // validate: [
      //   (date) => {
      //     const dt = new Date(date);
      //     return !isNaN(dt.getTime()) && dt.getTime() >= Date.now();
      //   },
      //   "must be valid date and greater than now",
      // ],
    },
  },
  { timestamps: true }
);

const Company = new mongoose.model("Company", companySchema);

module.exports = Company;
