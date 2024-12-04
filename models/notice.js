const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["success", "info", "danger"],
    required: true,
  },

  status: {
    type: String,
    enum: ["draft", "active", "inactive"],
    required: true,
  },

  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
