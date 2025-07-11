const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

const allowedOrigin = process.env.FRONTEND_URL;

// ✅ CORS Setup
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

// ✅ Handle preflight OPTIONS requests
app.options('*', cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api', authRoutes);

// ✅ DB + Start
connectDB().then(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('✅ Server is running on port 8080');
  });
});
