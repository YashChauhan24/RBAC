const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const { sendMail } = require("../libs/mailer");
const Admin = require("../models/admin");

const addAdmin = async (req, res, next) => {
  try {
    const admin = req.admin;
    const { name, email, phone, roles } = req.body;

    const randomPassword = crypto.randomBytes(8).toString("hex");

    const user = await Admin.create({
      name,
      email,
      phone,
      roles,
      password: randomPassword,
    });

    sendMail(
      email,
      "Onboard Request",
      `You are welcome to onboard via ${admin.name}.\nPlease go to ${process.env.ORIGIN}/ and sign in with this email. Your temporary password is ${randomPassword}`
    );

    res.status(200).json({ data: { message: "Admin Added Successfully" } });
  } catch (error) {
    console.log(error);
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      next({ st: 400, ms: "Email is already registered" });
    } else {
      next({ st: 500, ms: error.message });
    }
  }
};

const getAllAdmins = async (req, res, next) => {
  try {
    const { n = 10, p = 0 } = req.query;

    const admins = await Admin.find({}, "name email isBlocked isSuperAdmin")
      .skip(n * p)
      .limit(+n)
      .lean();

    const count = await Admin.countDocuments({});

    res.status(200).json({ data: { admins, count } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getAdminDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id, "-password -hash -__v").lean();
    if (!admin) return next({ st: 400, ms: "Admin not found" });

    res.status(200).json({ data: { admin } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const updateAdminDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, isBlocked, isVerified, roles } = req.body;

    const updation = { name, phone, isBlocked, isVerified, roles };

    const admin = await Admin.findById(id);
    if (!admin) return next({ st: 400, ms: "Admin not found" });

    for (const [key, value] of Object.entries(updation)) {
      // console.log([key, value]);
      if (admin.isSuperAdmin && key === "isBlocked" && !!value) continue;
      // console.log({ key, value });
      if (value !== undefined && value !== null) {
        admin[key] = value;
      }
    }
    await admin.save();

    // const { password, ...rest } = admin;

    res.status(200).json({ data: { message: "Admin Updated Succesfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Admin.deleteOne({ _id: id, isSuperAdmin: false });
    console.log("admin delete result", result);

    res.status(200).json({ data: { message: "Admin Deleted Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  addAdmin,
  getAllAdmins,
  getAdminDetails,
  updateAdminDetails,
  deleteAdmin,
};
