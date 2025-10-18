const { supabase } = require("../config/db.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([{ name, email, message }])
      .select();

    if (error) throw error;

    //  Send response immediately to avoid timeout
    res.status(201).json({ 
      success: true, 
      data,
      message: "Message received successfully!" 
    });

    //  Send emails asynchronously (won’t block response)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      replyTo: email,
      html: `<p><strong>Name:</strong> ${name}</p><p>${message}</p>`
    };

    const autoReply = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for reaching out!",
      html: `<p>Hi ${name},</p><p>Thank you for your message. I’ll get back to you soon.</p>`
    };

    // Run asynchronously (no await)
    transporter.sendMail(mailOptions).catch(console.error);
    transporter.sendMail(autoReply).catch(console.error);

  } catch (err) {
    console.error("Contact form error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};
