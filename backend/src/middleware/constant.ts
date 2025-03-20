import nodemailer from "nodemailer";
import { Config_Url } from "../config";

/**
 * Send login credentials via email.
 */
export const sendEmail = async (email: string, password: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: Config_Url.EMAIL_USER,
      pass: Config_Url.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: Config_Url.EMAIL_USER,
    to: email,
    subject: "Your Employee Login Credentials",
    text: `Welcome to the DLK Task!\n\nYour login credentials are:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after login.`,
  };

  await transporter.sendMail(mailOptions);
};
