const { supabase } = require("../config/db.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("messages")
      .insert([{ name, email, message }])
      .select();

    if (error) throw error;

    //  Email to you
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      replyTo: email,
      html: `<p><strong>Name:</strong> ${name}</p><p>${message}</p>`,
    };

    //  Auto-reply to visitor
    const autoReply = {
      from: `"Collins Wanjiru | Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hi ${name}!</h2>
          <p>Thank you for contacting me through my portfolio. I've received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your message:</strong></p>
            <p style="margin: 10px 0 0 0; color: #666; white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br><strong>Collins Wanjiru</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      `,
    };

    //  Wait for both to finish and log results
    const [sentToYou, sentToClient] = await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(autoReply),
    ]);

    console.log(" Email to you:", sentToYou.response);
    console.log(" Auto-reply:", sentToClient.response);

    //  Now respond to frontend
    res.status(201).json({
      success: true,
      data,
      message: "Message and emails sent successfully!",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};
