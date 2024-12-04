const Company = require("../models/company");
const Employee = require("../models/employee");
const History = require("../models/history");

// Get all companies
const getAllCompanies = async (req, res, next) => {
  try {
    const { n = 1, p = 0 } = req.query;
    const companies = await Company.find({}, "-password -otp -hash")
      .populate("planCurrent", "name billed")
      .skip(n * p || 0)
      .limit(+n || 1)
      .lean();

    const count = await Company.countDocuments({});
    res.status(200).json({ data: { companies, count } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

// Get all companies
const getAllCompaniesLean = async (req, res, next) => {
  try {
    const companies = await Company.find({}, "name email").lean();

    res.status(200).json({ data: { companies } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

// Get company details by ID
const getCompanyDetails = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const company = await Company.findById(cid, "-password -otp -hash -__v")
      .populate("planCurrent", "name billed")
      .lean();
    if (!company) return next({ st: 400, ms: "Company not found" });

    res.status(200).json({ data: { company } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

// Update company details
const updateCompanyDetails = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const {
      isBlocked,
      planCurrent,
      employeeLimit,
      bayut,
      propertyfinder,
      dubaidubizzle,
      emiratesauction,
      nextRenewal,
    } = req.body;

    const company = await Company.findById(cid);
    if (!company) return next({ st: 400, ms: "Company not found" });

    const updation = {
      isBlocked,
      planCurrent,
      employeeLimit,
      bayut,
      propertyfinder,
      dubaidubizzle,
      emiratesauction,
      nextRenewal,
    };

    for (const [key, value] of Object.entries(updation))
      if (value !== undefined && value !== null) company[key] = value;
    await company.save();

    res.status(200).json({ data: { message: "Company Updated Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

// Get company all employees
const getCompanyEmployees = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const company = await Company.findById(cid, "-password -otp -hash -__v")
      .populate("planCurrent", "name billed")
      .lean();
    if (!company) return next({ st: 400, ms: "Company not found" });

    const employees = await Employee.find(
      { company: company._id },
      "-password -__v"
    ).lean();

    res.status(200).json({ data: { company, employees } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

// Get company one employees
const getCompanyEmployee = async (req, res, next) => {
  try {
    const { eid } = req.params;

    const employee = await Employee.findOne(
      { _id: eid },
      "-password -__v"
    ).lean();
    if (!employee) return next({ st: 400, ms: "Employee not found" });

    res.status(200).json({ data: { employee } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

// Get company all employees
const updateCompanyEmployee = async (req, res, next) => {
  try {
    const { eid } = req.params;

    const { bayut, propertyfinder, dubaidubizzle, emiratesauction } = req.body;

    const employee = await Employee.findById(eid);
    if (!employee) return next({ st: 400, ms: "Employee not found" });

    if (typeof bayut === "boolean") employee.bayut = bayut;
    if (typeof propertyfinder === "boolean")
      employee.propertyfinder = propertyfinder;
    if (typeof dubaidubizzle === "boolean")
      employee.dubaidubizzle = dubaidubizzle;
    if (typeof emiratesauction === "boolean")
      employee.emiratesauction = emiratesauction;
    await employee.save();

    res
      .status(200)
      .json({ data: { message: "Employee Updated Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getCompanyHistory = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { p = 0, n = 10, s = "", e = "" } = req.query;

    const company = await Company.findById(cid, "-password -otp -hash -__v");
    if (!company) return next({ st: 400, ms: "Company not found" });

    const filter = { company: company._id };
    if (s) filter.site = s;
    if (e) filter.employee = e;

    const histories = await History.find(filter)
      .populate("company", "name email")
      .populate("employee", "name email")
      .sort("-ts")
      .skip(p * n || 0)
      .limit(+n || 10)
      .lean();

    const count = await History.countDocuments(filter);

    res.status(200).json({ data: { histories, count, company } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  getAllCompanies,
  getAllCompaniesLean,
  getCompanyDetails,
  updateCompanyDetails,
  getCompanyEmployees,
  getCompanyEmployee,
  updateCompanyEmployee,
  getCompanyHistory,
};
