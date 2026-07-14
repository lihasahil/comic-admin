import nodemailer from "nodemailer";

const useSSL = process.env.SMTP_USE_SSL === "true";
const useTLS = process.env.SMTP_USE_TLS === "true";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: useSSL, // true only for port 465 (implicit SSL)
  requireTLS: !useSSL && useTLS, // STARTTLS on port 587 (Office365 default)
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const fromEmail = process.env.SMTP_FROM_EMAIL || "no-reply@comicsmithai.net";
  const fromName = process.env.SMTP_FROM_NAME || "ComicSmith AI";

  return transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  });
}
