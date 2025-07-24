require('dotenv').config({ path: './config/.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const AuthRoutes = require('./routes/authRouter');
const TodoRoutes = require('./routes/todoRoutes');
const UserRoutes = require('./routes/userRoutes');
const path = require('path');
const os = require('os');

const app = express();
connectDB();


const corsOptions = {
  origin: ['http://localhost:3000', 
 'https://login-authentication-umber.vercel.app/login'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.get('/favicon.ico', (req, res) => res.status(204).end());


app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(bodyParser.json());
app.use(express.json());

app.use('/auth', AuthRoutes);
app.use('/api/todos', TodoRoutes);
app.use('/api/users', UserRoutes);

app.get('/', (req, res) => {
  res.send('Backend working on Vercel!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

