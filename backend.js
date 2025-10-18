const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); 
require('dotenv').config();

const contactRouter = require('./router/contactrouter.js');
// const projectRouter = require('./router/projectrouter.js');

const app = express();
const port = 8080;

// Middleware
app.use(
  cors({
    origin: "https://collins-wamiatu.vercel.app",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

//  Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email route
app.get("/test-email", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to yourself first
      subject: "Test Email from Colman Portfolio",
      text: "If you see this, Nodemailer is working correctly 🚀",
    });

    console.log("✅ Email sent:", info.response);
    res.send("✅ Email sent: " + info.response);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).send("Error: " + err.message);
  }
});

// Routes
app.use('/api/contact', contactRouter);
// app.use('/api/projects', projectRouter);

// Simple test route
app.get('/get', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
