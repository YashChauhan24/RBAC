const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../libs/mailer");
const Admin = require("../models/admin");

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return next({ st: 400, ms: "Account not found" });
    if (admin.isBlocked) return next({ st: 403, ms: "Accoint is blocked" });

    if (!(await bcrypt.compare(password, admin.password)))
      return next({ st: 401, ms: "Invalid Credentials" });

    if (!admin.isVerified) {
      admin.hash = Date.now() + 9e5; // 15 mins from now
      await admin.save();
      return res
        .status(201)
        .json({ data: { slug: admin.id + admin.hash.getTime().toString(16) } });
    }

    const payload = { id: admin._id };

    const token = jwt.sign(payload, process.env.COMPANYJWTKEY, {
      expiresIn: process.env.COMPANYJWTEXPIRE,
    });

    res.json({
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          roles: admin.roles,
          isSuperAdmin: admin.isSuperAdmin,
        },
      },
    });
  } catch (error) {
    console.error(error);
    next({ st: 500, ms: error.message });
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || admin.isBlocked) {
      res.status(200).json({ data: { message: "OK" } });
      return;
    }

    admin.hash = Date.now() + 9e5; // 15 mins from now
    await admin.save();

    sendMail(
      admin.email,
      "Reset Password Request",
      "Click only if requested by you else ignore and delete.\n\n" +
        `${process.env.ORIGIN}/resetpass/${admin.id}${admin.hash
          .getTime()
          .toString(16)}`
    );

    res.status(200).json({ data: { message: "OK" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { slug, password } = req.body;

    const aid = slug.slice(0, 24);
    const time = Number(`0x${slug.slice(24)}`);

    const admin = await Admin.findById(aid);

    if (
      !admin ||
      admin.isBlocked ||
      admin.hash.getTime() !== time ||
      Date.now() > time
    ) {
      res.status(200).json({ data: { message: "OK" } });
      return;
    }

    admin.password = password;
    admin.isVerified = true;
    admin.hash = 0;
    await admin.save();

    res.status(200).json({ data: { message: "OK" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const authenticate =
  (role = "") =>
  async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!(authorization && authorization.startsWith("Bearer ")))
        return next({ st: 401, ms: "Missing Authorization Credential" });

      const token = authorization.slice(7);

      const { id } = jwt.verify(token, process.env.COMPANYJWTKEY);

      const admin = await Admin.findById(id);

      if (!admin || admin.isBlocked || !admin.isVerified)
        return next({ st: 401, ms: "Unauthorized Access" });

      if (!admin.isSuperAdmin && role && !admin.roles.includes(role))
        return next({ st: 403, ms: "Access Denied" });

      req.admin = admin;
      next();
    } catch (error) {
      console.error(error);
      return next({ st: 401, ms: "Unauthorized" });
    }
  };

module.exports = {
  signin,
  authenticate,
  changePassword,
  resetPassword,
};
