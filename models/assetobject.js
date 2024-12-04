const mongoose = require("mongoose");

const assetobjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  size: {
    type: Number,
    min: 128,
    max: 1024 * 1024 * 15,
  },

  mime: {
    type: String,
    required: true,
    trim: true,
  },
});

const AssetObject = new mongoose.model("AssetObject", assetobjectSchema);

module.exports = AssetObject;
