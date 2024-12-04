const Payment = require("../models/payment");

// Get all payments
const getAllPayments = async (req, res, next) => {
  try {
    const { n = 10, p = 0, sd = "", ed = "", st = "", co = "" } = req.query;

    const filter = {};
    if (st) filter.status = st;
    if (co) filter.company = co;
    if (sd || ed) {
      filter.createdAt = {};
      if (sd) filter.createdAt.$gte = sd;
      if (ed) filter.createdAt.$lte = ed;
    }

    const payments = await Payment.find(
      filter,
      "company plan users status intent.amount intent.currency createdAt"
    )
      .populate("company", "name")
      .populate("plan", "name")
      .sort("-_id")
      .skip(p * n)
      .limit(+n)
      .lean();

    const count = await Payment.countDocuments(filter);

    res.status(200).json({ data: { payments, count } });
  } catch (error) {
    next({ st: 500, ms: error.message });
    console.log(error);
  }
};

// Get payment details by ID
const getPaymentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("company", "-password -otp -hash -planCurrent -__v")
      .populate("plan", "-__v");
    if (!payment) return next({ st: 400, ms: "Payment not found" });

    res.status(200).json({ data: { payment } });
  } catch (error) {
    next({ st: 500, ms: error.message });
    console.log(error);
  }
};

module.exports = {
  getAllPayments,
  getPaymentDetails,
};
