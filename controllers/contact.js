const { supabase } = require("../config/db.js");
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    //  Save to Supabase
    const { data, error } = await supabase
      .from("messages")
      .insert([{ name, email, message }])
      .select();

    if (error) throw error;

    //  Send notification to you
   

    //  Auto-reply to the visitor
    await resend.emails.send({
      from: "Collins Wanjiru <onboarding@resend.dev>", // verified sender
      to: email,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hi ${name}!</h2>
          <p>Thank you for contacting me through my portfolio. I've received your message and will get back to you soon.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="color: #666; white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br><strong>Collins Wanjiru</strong></p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      data,
      message: "Message sent successfully and auto-reply delivered ✅",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};
