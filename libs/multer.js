const path = require("node:path");
const multer = require("multer");
const mongoose = require("mongoose");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = path.resolve(process.env.UPLOADSDIR);
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    req.fid = new mongoose.Types.ObjectId();
    const ext = path.extname(file.originalname);
    if (!ext) cb(new Error("File not safe"));
    cb(null, `${req.fid}${ext}`);
  },
});

const storage = multer({ storage: diskStorage });
module.exports = { storage };
