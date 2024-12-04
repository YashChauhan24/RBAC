const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },

    site: {
      type: String,
      enum: ["bayut", "propertyfinder", "dubaidubizzle", "emiratesauction"],
      required: true,
    },

    // history stuff here

    title: String,
    url: String,
    ts: Number,
  },
  { timestamps: true }
);

const History = new mongoose.model("History", historySchema);

module.exports = History;
