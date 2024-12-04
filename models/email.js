const mongoose = require("mongoose");

const emailSchema = mongoose.Schema(
  {
    smtp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Smtp",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    to: {
      type: String,
    },
    from: {
      type: String,
    },
    subject: {
      type: String,
    },
    body: {
      type: String,
    },
    response: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
