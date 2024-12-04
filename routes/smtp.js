const Smtp = require("../models/smtp");
const verifySMTP = require("../utils/verifySmtp");

const getSmtps = async (req, res, next) => {
  try {
    const { n = 10, p = 0, s = "" } = req.query;

    const filter = { name: { $regex: s, $options: "i" } };

    const smtps = await Smtp.find(filter)
      .sort("-_id")
      .skip(n * p || 0)
      .limit(+n || 10)
      .lean();

    const count = await Smtp.countDocuments(filter);

    res.status(200).json({ data: { smtps, count } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getSmtpDetails = async (req, res, next) => {
  try {
    const { sid } = req.params;

    const smtp = await Smtp.findById(sid).lean();
    if (!smtp) return next({ st: 400, ms: "Smtp record not found" });

    res.status(200).json({ data: { smtp } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const createSmtp = async (req, res, next) => {
  try {
    const { name, host, port, secure, userName, password, fromEmail, fromName } = req.body;

    const verify = await verifySMTP({ host, port, secure, userName, password });
    if (!verify) return next({ st: 406, ms: "Bad SMTP Credentials" });

    const smtp = await Smtp.create({
      name,
      host,
      port,
      secure,
      userName,
      password,
      fromEmail,
      fromName,
    });

    res.status(200).json({ data: { message: "Smtp Created Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const setDefaultSmtp = async (req, res, next) => {
  try {
    const { sid } = req.params;

    const smtp = await Smtp.findById(sid);
    if (!smtp) return next({ st: 400, ms: "Smtp record not found" });

    await Smtp.updateMany({ _id: { $ne: smtp._id } }, { $set: { isDefault: false } });
    smtp.isDefault = true;
    await smtp.save();

    res.status(200).json({ data: { message: "Smtp Set as Default" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const updateSmtp = async (req, res, next) => {
  try {
    const { sid } = req.params;
    const { name, host, port, secure, userName, password, fromEmail, fromName } = req.body;

    const smtp = await Smtp.findById(sid);
    if (!smtp) return next({ st: 400, ms: "Smtp record not found" });

    const updates = {
      name,
      host,
      port,
      secure,
      userName,
      password,
      fromEmail,
      fromName,
    };

    for (const [key, value] of Object.entries(updates)) if (value !== undefined || value !== null) smtp[key] = value;
    await smtp.save();

    res.status(200).json({ data: { message: "Smtp Updated Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const deleteSmtp = async (req, res, next) => {
  try {
    const { sid } = req.params;

    const result = await Smtp.deleteOne({ _id: sid, isDefault: false });
    console.log("smtp delete result", result);

    res.status(200).json({ data: { message: "Smtp Deleted Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  getSmtps,
  getSmtpDetails,
  createSmtp,
  setDefaultSmtp,
  updateSmtp,
  deleteSmtp,
};
