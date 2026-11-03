import nodemailer from "nodemailer";

// Sends one email using the project Gmail
const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // the 16-character app password
    },
  });

  await transporter.sendMail({
    from: `"Campus Prep" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

export default sendEmail;