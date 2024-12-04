const AssetObject = require("../models/assetobject");

const uploadAsset = async (req, res, next) => {
  try {
    const { filename, mimetype, size } = req.file;
    const _id = req.fid;

    const asset = await AssetObject.create({
      _id,
      size,
      name: filename,
      mime: mimetype,
    });

    res.status(200).json({ data: { aid: asset.id, name: asset.name } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = { uploadAsset };
