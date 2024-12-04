const nodemailer = require("nodemailer");

const verifySMTP = async ({ host = "", port = 0, secure = "None", userName = "", password = "" }) => {
  try {
    const transporter = nodemailer.createTransport({
      secure: secure !== "None",
      host: host,
      port: +port,
      auth: {
        user: userName,
        pass: password,
      },
    });

    await transporter.verify();

    return transporter;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = verifySMTP;
