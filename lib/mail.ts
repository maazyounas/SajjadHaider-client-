import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: MailOptions) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "SH Academy <noreply@shacademy.com>",
    to,
    subject,
    html,
  });
}

export function resetPasswordTemplate(name: string, resetUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0d6b58, #0a5a4a); padding: 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎓 SH Academy</h1>
      </div>
      <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="color: #0a1628; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #6b7280;">Hi ${name},</p>
        <p style="color: #6b7280;">You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: #0d6b58; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;
}
