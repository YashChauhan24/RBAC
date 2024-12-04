require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const api = require("./api.js");
const initialize = require("./initialize.js");

app.use(cors());

app.get("/ping", (_, res) => res.status(200).json({ message: "All Good" }));

app.use("/assets", express.static(process.env.UPLOADSDIR));

app.use("/api", api);

mongoose
  .connect(process.env.MONGOURI)
  .then(() => initialize())
  .then(() =>
    app.listen(process.env.PORT, process.env.HOST, () => console.log(`Server listning on port ${process.env.PORT}`))
  )
  .catch((e) => console.log(e));
