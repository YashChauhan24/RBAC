const { resolve, join } = require("node:path");
const { readdir, unlink } = require("node:fs/promises");
const Admin = require("../models/admin");
const Assetobject = require("../models/assetobject");
const Company = require("../models/company");
const Coupon = require("../models/coupon");
const Email = require("../models/email");
const Employee = require("../models/employee");
const History = require("../models/history");
const Notice = require("../models/notice");
const Payment = require("../models/payment");
const Plan = require("../models/plan");
const Setting = require("../models/setting");
const Smtp = require("../models/smtp");
const testdata = require("../test.json");

const getSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findOne()
      .populate("logo")
      .populate("smlogo")
      .populate("darkLogo")
      .populate("favIcon")
      .populate("emailLogo")
      .lean();
    res.status(200).json({ data: { setting } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const createSetting = async (req, res, next) => {
  try {
    const {
      billingAddress,
      logo,
      smlogo,
      darkLogo,
      favIcon,
      emailLogo,
      facebook,
      instagram,
      twitter,
      linkedIn,
      reddit,
      youtube,
      telegram,
      pinterest,
    } = req.body;

    const setting = await Setting.create({
      billingAddress,
      logo,
      smlogo,
      darkLogo,
      favIcon,
      emailLogo,
      facebook,
      instagram,
      twitter,
      linkedIn,
      reddit,
      youtube,
      telegram,
      pinterest,
    });

    res.status(200).json({ data: { message: "Setting Created Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const updateSetting = async (req, res, next) => {
  try {
    const {
      logo,
      smlogo,
      darkLogo,
      favIcon,
      emailLogo,
      billingAddress,
      facebook,
      instagram,
      twitter,
      linkedIn,
      reddit,
      youtube,
      telegram,
      pinterest,
    } = req.body;

    const updation = {
      logo,
      smlogo,
      darkLogo,
      favIcon,
      emailLogo,
      billingAddress,
      facebook,
      instagram,
      twitter,
      linkedIn,
      reddit,
      youtube,
      telegram,
      pinterest,
    };

    const setting = await Setting.findOne();

    for (const [key, value] of Object.entries(updation))
      if (value !== undefined || value !== null) setting[key] = value;
    await setting.save();

    res.status(200).json({ data: { message: "Setting Updated Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getEmails = async (req, res, next) => {
  try {
    const { p = 0, n = 10, c = "" } = req.query;

    const emails = await Email.find({})
      .populate("smtp", "name fromEmail isDefault")
      .populate("company", "name email")
      .sort("-_id")
      .skip(p * n || 0)
      .limit(+n || 10)
      .lean();

    const count = await Email.countDocuments({});

    res.status(200).json({ data: { emails, count } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const { y } = req.query;
    const now = new Date();
    const year = +y || now.getFullYear();

    const companies = await Company.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
          planCurrent: {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          companies: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          month: "$_id",
          companies: {
            _id: 1,
            name: 1,
            email: 1,
          },
          _id: 0,
        },
      },
    ]);

    const payments = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
          status: "succeeded",
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          payments: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          month: "$_id",
          payments: {
            _id: 1,
            company: 1,
            plan: 1,
            users: 1,
            intent: {
              amount: 1,
              description: 1,
            },
          },
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "payments.company",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "payments.plan",
          foreignField: "_id",
          as: "planDetails",
        },
      },
      {
        $project: {
          month: 1,
          payments: {
            $map: {
              input: "$payments",
              as: "payment",
              in: {
                _id: "$$payment._id",
                company: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$companyDetails",
                        cond: { $eq: ["$$this._id", "$$payment.company"] },
                      },
                    },
                    0,
                  ],
                },
                plan: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$planDetails",
                        cond: { $eq: ["$$this._id", "$$payment.plan"] },
                      },
                    },
                    0,
                  ],
                },
                users: "$$payment.users",
                intent: "$$payment.intent",
              },
            },
          },
        },
      },
      {
        $project: {
          month: 1,
          payments: {
            _id: 1,
            company: { _id: 1, name: 1 },
            plan: { _id: 1, name: 1 },
            users: 1,
            intent: 1,
          },
        },
      },
    ]);

    res.status(200).json({ data: { companies, payments } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const clearDB = async (req, res, next) => {
  try {
    await Admin.deleteMany({});
    await Assetobject.deleteMany({});
    await Company.deleteMany({});
    await Coupon.deleteMany({});
    await Email.deleteMany({});
    await Employee.deleteMany({});
    await History.deleteMany({});
    await Notice.deleteMany({});
    await Payment.deleteMany({});
    await Plan.deleteMany({});
    await Setting.deleteMany({});
    await Smtp.deleteMany({});

    const uploadspath = resolve(process.env.UPLOADSDIR);
    const files = await readdir(uploadspath);
    for (const file of files)
      if (file !== ".gitignore") await unlink(join(uploadspath, file));

    res.status(200).json({ data: { message: "DB Cleared Succesfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const addData = async (req, res, next) => {
  try {
    const {
      admins,
      coupons,
      companies,
      employees,
      histories,
      emails,
      plans,
      smtps,
      notices,
    } = testdata;

    await Admin.deleteMany({});
    await Assetobject.deleteMany({});
    await Company.deleteMany({});
    await Coupon.deleteMany({});
    await Email.deleteMany({});
    await Employee.deleteMany({});
    await History.deleteMany({});
    await Notice.deleteMany({});
    await Payment.deleteMany({});
    await Plan.deleteMany({});
    await Setting.deleteMany({});
    await Smtp.deleteMany({});

    await Plan.create(plans);
    await Smtp.create(smtps);
    await Notice.create(notices);
    await Admin.create(admins);
    await Coupon.create(coupons);
    await Company.create(companies);
    await Employee.create(employees);
    await History.create(histories);
    await Email.create(emails);

    const uploadspath = resolve(process.env.UPLOADSDIR);
    const files = await readdir(uploadspath);
    for (const file of files)
      if (file !== ".gitignore") await unlink(join(uploadspath, file));

    res.status(200).json({ data: { message: "Test Data added" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  getSetting,
  updateSetting,
  createSetting,
  getEmails,
  getDashboard,
  clearDB,
  addData,
};
