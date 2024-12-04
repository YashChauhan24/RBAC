const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },

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

  password: {
    type: String,
    required: true,
    set: (p) => bcrypt.hashSync(p, 10),
  },

  // Mabe not needed once plan added

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

const Employee = new mongoose.model("Employee", employeeSchema);

module.exports = Employee;
