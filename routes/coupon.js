const Coupon = require("../models/coupon");

const createCoupon = async (req, res, next) => {
  try {
    const { code, info, type, value, upto, startDate, endDate, useOnce, firstSub, minAmount, isActive } =
      req.body;

    const coupon = await Coupon.create({
      code,
      info,
      type,
      value,
      upto,
      startDate,
      endDate,
      useOnce,
      firstSub,
      minAmount,
      isActive,
    });

    res.status(201).json({ data: { message: "Added New Coupon" } });
  } catch (error) {
    console.log(error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.code)
      next({ st: 400, ms: "Coupon code already exists" });
    else next({ st: 500, ms: error.message });
  }
};

const getAllCoupons = async (req, res, next) => {
  try {
    const { n = 10, p = 0, t, sd, ed } = req.query;

    const filter = {};
    if (t) filter.type = t;
    if (sd) filter.startDate = { $gte: new Date(sd) };
    if (ed) filter.endDate = { $lte: new Date(ed) };

    const coupons = await Coupon.find(filter)
      .skip(p * n || 0)
      .limit(+n || 10)
      .sort("-_id")
      .lean();

    const count = await Coupon.countDocuments(filter);

    res.status(200).json({ data: { coupons, count } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getCouponDetails = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const coupon = await Coupon.findById(cid);
    if (!coupon) return next({ st: 400, ms: "Coupon Not Found" });

    res.status(200).json({ data: { coupon } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { code, info, type, value, upto, startDate, endDate, useOnce, firstSub, minAmount, isActive } =
      req.body;

    const coupon = await Coupon.findById(cid);
    if (!coupon) return next({ st: 400, ms: "Coupon Not Found" });

    const updation = {
      code,
      info,
      type,
      value,
      upto,
      startDate,
      endDate,
      useOnce,
      firstSub,
      minAmount,
      isActive,
    };

    for (const [key, value] of Object.entries(updation))
      if (value !== undefined && value !== null) coupon[key] = value;
    await coupon.save();

    res.status(200).json({ data: { message: "Coupon Updated Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const result = await Coupon.deleteOne({ _id: cid });

    if (result.deletedCount === 0) return next({ st: 400, ms: "Coupon Not Found" });

    res.status(200).json({ data: { message: "Coupons Deleted Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponDetails,
  updateCoupon,
  deleteCoupon,
};
