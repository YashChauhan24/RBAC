const Admin = require("./models/admin");

const initialize = async () => {
  const admin = await Admin.findOne({ isSuperAdmin: true }).lean();
  if (!admin) {
    const superAdmin = new Admin({
      name: "Super Admin",
      email: "superAdmin@gmail.com",
      password: "superadmin",
      isSuperAdmin: true,
      phone: "918308018609",
      isBlocked: false,
      isVerified: true,
    });
    await superAdmin.save();
  } else {
    console.log("Super Admin already exists.");
  }
};

module.exports = initialize;
