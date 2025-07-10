const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); 




dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes); 

connectDB().then(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running on port 8080');
  });
});
