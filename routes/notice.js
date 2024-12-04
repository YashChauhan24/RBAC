const Notice = require("../models/notice");

const createNotice = async (req, res, next) => {
  try {
    const { text, type, status, startDate, endDate } = req.body;

    const notice = await Notice.create({
      text,
      type,
      status,
      startDate,
      endDate,
    });

    res.status(201).json({ data: { message: "Notice Created Successfully" } });
  } catch (error) {
    console.error(error);
    next({ st: 500, ms: error.message });
  }
};

const getAllNotices = async (req, res, next) => {
  try {
    const { n = 10, p = 0, t, s, sd, ed } = req.query;

    const filter = {};
    if (t) filter.type = t;
    if (s) filter.status = s;
    if (sd) filter.startDate = { $gte: new Date(sd) };
    if (ed) filter.endDate = { $lte: new Date(ed) };

    const notices = await Notice.find(filter)
      .skip(p * n || 0)
      .limit(+n || 10)
      .sort("-_id")
      .lean();

    const count = await Notice.countDocuments(filter);

    res.status(200).json({ data: { notices, count } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getNoticeDetails = async (req, res, next) => {
  try {
    const { nid } = req.params;

    const notice = await Notice.findById(nid);
    if (!notice) return next({ st: 400, ms: "Notice not found" });

    res.status(200).json({ data: { notice } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const updateNotice = async (req, res, next) => {
  try {
    const { nid } = req.params;
    const { text, type, status, startDate, endDate } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      nid,
      {
        $set: {
          text,
          type,
          status,
          startDate,
          endDate,
        },
      },
      { new: true, runValidators: true }
    );

    if (!notice) return next({ st: 400, ms: "Notice not found" });

    res.status(200).json({ data: { message: "Notice Updated Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    const { nid } = req.params;

    const result = await Notice.deleteOne({ _id: nid });

    if (result.deletedCount === 0)
      return next({ st: 400, ms: "Notice not found" });

    res.status(200).json({ data: { message: "Notices Deleted Successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  createNotice,
  getAllNotices,
  getNoticeDetails,
  updateNotice,
  deleteNotice,
};
