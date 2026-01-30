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
    const { email, userId } = req.body;

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
      subject: '🎉 Congratulations — You completed all games!',
      html: `
        <h2>Congratulations, voyager!</h2>
        <p>You have successfully completed all games in the SAP Voyager Passport.</p>
        <p>Here is your winning badge 🎖</p>
      `
    });
    res.json({ success: true });
  } catch (err) {
    console.error("SMTP Error Details:", err);
    res.status(500).json({ error: 'Email failed to send' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
