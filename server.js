const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const AuthRoutes = require('./routes/authRouter');
// const ProductsRoutes = require('./routes/productsRouter');
const TodoRoutes = require('./routes/todoRoutes')
require('dotenv').config({path: './config/.env' });
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Add this to your Express app configuration

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

connectDB();
app.use(bodyParser.json())
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/auth', AuthRoutes);  
// app.use('/products', ProductsRoutes);  
app.use('/api/todos', TodoRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 