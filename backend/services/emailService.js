const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
};

const sendVerificationEmail = async ({ to, name, token, otp }) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyLink = `${clientUrl}/verify-email?token=${token}&email=${encodeURIComponent(to)}`;
  const from = process.env.EMAIL_FROM || '"LocalServe Platform" <no-reply@localserve.in>';

  const subject = 'Verify your LocalServe Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #6b21a8; margin-top: 0;">Welcome to LocalServe, ${name}!</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Thank you for creating an account with LocalServe. Please verify your email address to activate your account and start booking verified local services.
      </p>
      
      <div style="background: #f3e8ff; border-radius: 6px; padding: 18px; text-align: center; margin: 24px 0;">
        <span style="font-size: 14px; color: #6b21a8; font-weight: bold; display: block; margin-bottom: 6px;">YOUR 6-DIGIT VERIFICATION CODE:</span>
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #581c87;">${otp}</span>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${verifyLink}" style="background: #7e22ce; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>

      <p style="color: #64748b; font-size: 13px;">
        Or copy and paste this link in your browser:<br/>
        <a href="${verifyLink}" style="color: #7e22ce; word-break: break-all;">${verifyLink}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        If you did not create a LocalServe account, please ignore this email. This link and code expire in 24 hours.
      </p>
    </div>
  `;

  const transporter = createTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      console.log(`[EmailService] Verification email sent to: ${to}`);
      return { success: true };
    } catch (err) {
      console.error(`[EmailService] Failed to send email via SMTP: ${err.message}`);
    }
  }

  // Fallback: Log to console in development when SMTP credentials are not yet configured
  console.log('------------------------------------------------------------');
  console.log(`[EmailService DEV SIMULATION] Verification email for: ${to}`);
  console.log(`[EmailService DEV SIMULATION] OTP: ${otp}`);
  console.log(`[EmailService DEV SIMULATION] Verification Link: ${verifyLink}`);
  console.log('------------------------------------------------------------');

  return { success: true, simulated: true, otp, verifyLink };
};

const sendPasswordResetEmail = async ({ to, name, token }) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetLink = `${clientUrl}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;
  const from = process.env.EMAIL_FROM || '"LocalServe Platform" <no-reply@localserve.in>';

  const subject = 'Reset your LocalServe Password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #6b21a8; margin-top: 0;">Password Reset Request</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Hello ${name}, we received a request to reset your LocalServe account password.
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetLink}" style="background: #7e22ce; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset My Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px;">This reset link expires in 1 hour.</p>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({ from, to, subject, html });
      return { success: true };
    } catch (err) {
      console.error(`[EmailService] SMTP Error: ${err.message}`);
    }
  }

  console.log('------------------------------------------------------------');
  console.log(`[EmailService DEV SIMULATION] Password Reset for: ${to}`);
  console.log(`[EmailService DEV SIMULATION] Reset Link: ${resetLink}`);
  console.log('------------------------------------------------------------');

  return { success: true, simulated: true, resetLink };
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
