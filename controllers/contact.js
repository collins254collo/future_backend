const { supabase } = require("../config/db.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields required" });
    }

    //  Save to Supabase
    const { data, error } = await supabase
      .from("messages")
      .insert([{ name, email, message }])
      .select();

    if (error) throw error;

    //  Send message to YOU (from sender)
    await transporter.sendMail({
      from: `"${name}" <${email}>`, 
      to: process.env.RECEIVER_EMAIL,
      subject: ` Portfolio message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Message from Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    //  2. Auto-reply to sender
    await transporter.sendMail({
      from: `"Collins Njogu" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thanks for contacting Collins Njogu ",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hey ${name},</h2>
          <p>Thank you for reaching out through my portfolio! I’ve received your message and will get back to you as soon as possible.</p>
          <p><strong>Your Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr />
          <p>Best regards,<br/>Collins Njogu</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      data,
      message: "Email sent to owner and auto-reply sent to sender ",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
