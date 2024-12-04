const Company = require("../models/company");
const Plan = require("../models/plan");

const getPlans = async (req, res, next) => {
  try {
    const { n = 1, p = 0, b, c } = req.query;

    const filter = {};
    if (b) filter.billed = b;
    if (c) filter.currency = c;

    const count = await Plan.countDocuments(filter);

    const plans = await Plan.find(filter)
      .sort("-_id")
      .skip(n * p || 0)
      .limit(+n || 1)
      .lean();

    res.status(200).json({ data: { plans, count } });
  } catch (error) {
    console.error(error);
    next({ st: 500, ms: error.message });
  }
};

const getPlanDetails = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const plan = await Plan.findById(pid).lean();
    if (!plan) return next({ st: 400, ms: "Plan Not Found" });
    const companies = await Company.countDocuments({ planCurrent: plan._id });
    res.status(200).json({ data: { plan, companies } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const updatePlanDetails = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const { name, price, cost, currency, billed, bayut, propertyfinder, dubaidubizzle, emiratesauction } = req.body;

    const plan = await Plan.findById(pid);
    if (!plan) return res.status(400).json({ data: { message: "Plan Not Found" } });

    const updation = {
      name,
      price,
      cost,
      currency,
      billed,
      bayut,
      propertyfinder,
      dubaidubizzle,
      emiratesauction,
    };

    for (const [key, value] of Object.entries(updation)) if (value !== undefined && value !== null) plan[key] = value;
    await plan.save();

    res.status(200).json({ data: { message: "Plan Updated Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const deletePlan = async (req, res, next) => {
  try {
    const { pid } = req.params;

    const deleted = await Plan.findByIdAndDelete(pid);
    if (!deleted) return res.status(400).json({ data: { message: "Plan Not Found" } });

    res.status(200).json({ data: { message: "Plan Deleted Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const addPlan = async (req, res, next) => {
  try {
    const { name, price, cost, currency, billed, bayut, propertyfinder, dubaidubizzle, emiratesauction } = req.body;

    const plan = await Plan.create({
      name,
      price,
      cost,
      currency,
      billed,
      bayut,
      propertyfinder,
      dubaidubizzle,
      emiratesauction,
    });

    res.status(200).json({ data: { message: "Plan Added Successfully", plan } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  getPlans,
  getPlanDetails,
  updatePlanDetails,
  deletePlan,
  addPlan,
};
