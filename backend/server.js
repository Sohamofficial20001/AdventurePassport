import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-winner-badge', async (req, res) => {
  try {
    const { email, userId, certificationLink } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"SAP Voyager" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🎉 Congratulations — You earned the SAP Voyager Badge!',
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; padding: 20px; text-align: center;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <div style="background-color: #00152f; padding: 20px;">
            <h1 style="color: #c5a059; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 1px;">MISSION ACCOMPLISHED</h1>
          </div>
          <div style="padding: 30px 20px; color: #333; line-height: 1.5;">
            <h2 style="font-size: 20px; font-weight: 600; margin-top: 0;">Congratulations, ${userId || 'Voyager'}!</h2>
            <p style="font-size: 15px;">You've successfully completed all challenges in the <strong>SAP Voyager Program</strong>.</p>
            <div style="margin: 30px 0;">
              <span style="font-size: 70px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">🎖️</span>
            </div>
            ${certificationLink && certificationLink !== '#' ?
              `<a href="${certificationLink}" target="_blank" style="display: inline-block; background-color: #e67e22; color: #ffffff; padding: 12px 24px; margin-top: 10px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Certification</a>`
              : ''
            }
            <p style="font-size: 13px; color: #666; margin-top: 25px;">Thank you for participating in the Sopra Steria India Management Kick-Off 2026.</p>
          </div>
          <div style="background-color: #f0f4f8; padding: 15px; font-size: 11px; color: #888;">
            This is an automated message.
          </div>
        </div>
      </div>
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Email failed to send' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
