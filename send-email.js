const nodemailer = require('nodemailer');

// إعداد البريد
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_API_KEY
  }
});

// الدالة الرئيسية
module.exports = async (req, res) => {
  // السماح بـ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // إرسال البريد
    const info = await transporter.sendMail({
      from: process.env.BREVO_EMAIL,
      to: to,
      subject: subject,
      html: body.replace(/\n/g, '<br>')
    });

    console.log('✅ Email sent:', info.response);
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Email error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

