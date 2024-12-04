const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  billingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    phone: String,
    postalCode: String,
  },

  logo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssetObject",
  },

  smlogo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssetObject",
  },

  darkLogo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssetObject",
  },

  favIcon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssetObject",
  },

  emailLogo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssetObject",
  },

  facebook: String,
  instagram: String,
  twitter: String,
  linkedIn: String,
  reddit: String,
  youtube: String,
  telegram: String,
  pinterest: String,
});

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
