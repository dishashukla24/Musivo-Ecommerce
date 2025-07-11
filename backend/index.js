const express = require('express');
require('dotenv').config(); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); 

dotenv.config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? '✅ Loaded' : '❌ MISSING');


const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);


connectDB().then(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('✅ Server is running on port 8080');
  });
});
