const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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



// app.get("/test-resend", async (req, res) => {
//   try {
//     const data = await resend.emails.send({
//       from: "Test <onboarding@resend.dev>",
//       to: process.env.EMAIL_USER,
//       subject: "Render test email",
//       text: "If you see this, Resend works!",
//     });
//     res.json({ success: true, data });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


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
