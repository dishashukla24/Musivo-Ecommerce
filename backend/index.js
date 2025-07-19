const express = require('express');
require('dotenv').config(); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); 

dotenv.config();

console.log("✅ FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? '✅ Loaded' : '❌ MISSING');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,  
  credentials: true,                
}));

// ✅ Core middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Connect to DB and start server
connectDB().then(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('✅ Server is running on port 8080');
  });
});
