const nodemailer = require("nodemailer");
const Smtp = require("../models/smtp");
const Email = require("../models/email");

exports.sendMail = async (to = "", subject = "", text = "") => {
  console.log("sendMail:", { to, subject, text });
  try {
    const smtp = await Smtp.findOne({ isDefault: true }).lean();
    if (!smtp) throw new Error("No Default SMTP set");

    const transporter = nodemailer.createTransport({
      secure: smtp.secure !== "None",
      host: smtp.host,
      port: smtp.port,
      auth: {
        user: smtp.userName,
        pass: smtp.password,
      },
    });

    const verify = await transporter.verify();
    console.log(verify);

    const from = `${smtp.fromName}<${smtp.fromEmail}>`;

    const { response } = await transporter.sendMail({
      from,
      to,
      subject,
      text,
    });
    console.log(response);

    await Email.create({
      smtp: smtp._id,
      to,
      from,
      subject,
      body: text,
      response,
    });
  } catch (error) {
    console.log("send mail error", error);
  }
};
