const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

//  Routes
app.use('/api/contact', contactRouter);
// app.use('/api/projects', projectRouter);

// Test Route 
app.get('/get', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Start Server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
