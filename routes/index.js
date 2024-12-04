const express = require("express");
const { storage } = require("../libs/multer");
const {
  signin,
  authenticate,
  changePassword,
  resetPassword,
} = require("./auth");
const {
  getPlans,
  getPlanDetails,
  updatePlanDetails,
  deletePlan,
  addPlan,
} = require("./plan");
const {
  addAdmin,
  getAllAdmins,
  getAdminDetails,
  updateAdminDetails,
  deleteAdmin,
} = require("./adminUser");
const {
  getAllCompanies,
  getCompanyDetails,
  updateCompanyDetails,
  getCompanyEmployees,
  getCompanyHistory,
  updateCompanyEmployee,
  getAllCompaniesLean,
  getCompanyEmployee,
} = require("./company");
const { getAllPayments, getPaymentDetails } = require("./payment");
const { uploadAsset } = require("./assets");
const {
  getSetting,
  updateSetting,
  createSetting,
  getEmails,
  getDashboard,
  clearDB,
  addData,
} = require("./setting");
const {
  getSmtps,
  getSmtpDetails,
  createSmtp,
  setDefaultSmtp,
  updateSmtp,
  deleteSmtp,
} = require("./smtp");
const {
  createNotice,
  getAllNotices,
  getNoticeDetails,
  updateNotice,
  deleteNotice,
} = require("./notice");
const {
  createCoupon,
  getAllCoupons,
  getCouponDetails,
  updateCoupon,
  deleteCoupon,
} = require("./coupon");

const router = express.Router();

router.post("/signin", signin);
router.post("/changepassword", changePassword);
router.post("/resetpassword", resetPassword);

router.post("/plan", authenticate("plan-write"), addPlan);
router.get("/plans", authenticate("plan-read"), getPlans);
router.get("/plan/:pid", authenticate("plan-read"), getPlanDetails);
router.put("/plan/:pid", authenticate("plan-write"), updatePlanDetails);
router.delete("/plan/:pid", authenticate("plan-write"), deletePlan);

router.post("/user", authenticate("user-write"), addAdmin);
router.get("/users", authenticate("user-read"), getAllAdmins);
router.get("/user/:id", authenticate("user-read"), getAdminDetails);
router.put("/user/:id", authenticate("user-write"), updateAdminDetails);
router.delete("/user/:id", authenticate("user-write"), deleteAdmin);

router.get("/companies", authenticate("company-read"), getAllCompanies);
router.get("/allcompanies", authenticate("company-read"), getAllCompaniesLean);
router.get("/company/:cid", authenticate("company-read"), getCompanyDetails);
router.put(
  "/company/:cid",
  authenticate("company-write"),
  updateCompanyDetails
);
router.get(
  "/employees/:cid",
  authenticate("company-read"),
  getCompanyEmployees
);
router.get("/employee/:eid", authenticate("company-read"), getCompanyEmployee);
router.put(
  "/employee/:eid",
  authenticate("company-write"),
  updateCompanyEmployee
);
router.get("/histories/:cid", authenticate("company-read"), getCompanyHistory);

router.get("/payments", authenticate("payment-read"), getAllPayments);
router.get("/payment/:id", authenticate("payment-read"), getPaymentDetails);

//App assets upload

router.post(
  "/upload",
  authenticate("asset-write"),
  storage.single("file"),
  uploadAsset
);

//Notice

router.post("/notice", authenticate("notice-write"), createNotice);
router.get("/notices", authenticate("notice-read"), getAllNotices);
router.get("/notice/:nid", authenticate("notice-read"), getNoticeDetails);
router.put("/notice/:nid", authenticate("notice-write"), updateNotice);
router.delete("/notice/:nid", authenticate("notice-write"), deleteNotice);

// CouponCode

router.post("/coupon", authenticate("coupon-write"), createCoupon);
router.get("/coupons", authenticate("coupon-read"), getAllCoupons);
router.get("/coupon/:cid", authenticate("coupon-read"), getCouponDetails);
router.put("/coupon/:cid", authenticate("coupon-write"), updateCoupon);
router.delete("/coupon/:cid", authenticate("coupon-write"), deleteCoupon);

// App Settings

router.get("/setting", getSetting);
router.post("/setting", authenticate("setting-write"), createSetting);
router.put("/setting", authenticate("setting-write"), updateSetting);

// SMTP Settings

router.get("/smtps", authenticate("smtp-read"), getSmtps);
router.get("/smtp/:sid", authenticate("smtp-read"), getSmtpDetails);
router.post("/smtp", authenticate("smtp-write"), createSmtp);
router.get("/defaultsmtp/:sid", authenticate("smtp-write"), setDefaultSmtp);
router.put("/smtp/:sid", authenticate("smtp-write"), updateSmtp);
router.delete("/smtp/:sid", authenticate("smtp-write"), deleteSmtp);

// System emails

router.get("/emails", authenticate("email-read"), getEmails);

// dashboards

router.get("/dashboard", authenticate(), getDashboard);

router.delete("/cleardb", authenticate("db-write"), clearDB);
router.get("/adddata", authenticate("db-write"), addData);

module.exports = router;
