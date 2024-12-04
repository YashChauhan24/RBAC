const mongoose = require("mongoose");

const smtpSchema = new mongoose.Schema({
  name: { type: String },
  host: { type: String, required: true },
  port: { type: Number, required: true, min: 0, max: 65535 },
  secure: { type: String, required: true, enum: ["None", "SSL", "TLS", "STARTTLS"] },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  fromEmail: { type: String, required: true },
  fromName: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const Smtp = mongoose.model("Smtp", smtpSchema);

module.exports = Smtp;
