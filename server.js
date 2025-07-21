require('dotenv').config({path: './config/.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const AuthRoutes = require('./routes/authRouter');
const TodoRoutes = require('./routes/todoRoutes')
const UserRoutes = require('./routes/userRoutes');
const path = require('path');
const os =require('os');
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

connectDB();
app.use(bodyParser.json())
// app.use(cors());
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  const serverInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpuCount: os.cpus().length,
    totalMemory: (os.totalmem() / (1024 * 1024)).toFixed(2) + ' MB',
    freeMemory: (os.freemem() / (1024 * 1024)).toFixed(2) + ' MB',
    uptime: (os.uptime() / 60 / 60).toFixed(2) + ' hours',
    nodeVersion: process.version,
    serverSoftware: 'Node.js + Express',
    serverStartTime: new Date().toLocaleString()
  };

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Information</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      h1 {
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
        padding-bottom: 10px;
      }
      .info-item {
        margin-bottom: 10px;
      }
      .info-label {
        font-weight: bold;
        display: inline-block;
        width: 200px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Server Information</h1>
      
      <div class="info-item">
        <span class="info-label">Hostname:</span>
        ${serverInfo.hostname}
      </div>
      
      <div class="info-item">
        <span class="info-label">Platform:</span>
        ${serverInfo.platform}
      </div>
      
      <div class="info-item">
        <span class="info-label">Architecture:</span>
        ${serverInfo.arch}
      </div>
      
      <div class="info-item">
        <span class="info-label">CPU Cores:</span>
        ${serverInfo.cpuCount}
      </div>
      
      <div class="info-item">
        <span class="info-label">Total Memory:</span>
        ${serverInfo.totalMemory}
      </div>
      
      <div class="info-item">
        <span class="info-label">Free Memory:</span>
        ${serverInfo.freeMemory}
      </div>
      
      <div class="info-item">
        <span class="info-label">System Uptime:</span>
        ${serverInfo.uptime}
      </div>
      
      <div class="info-item">
        <span class="info-label">Node.js Version:</span>
        ${serverInfo.nodeVersion}
      </div>
      
      <div class="info-item">
        <span class="info-label">Server Software:</span>
        ${serverInfo.serverSoftware}
      </div>
      
      <div class="info-item">
        <span class="info-label">Server Start Time:</span>
        ${serverInfo.serverStartTime}
      </div>
    </div>
  </body>
  </html>
  `;

  res.send(html);
});


app.use('/auth', AuthRoutes);  
// app.use('/products', ProductsRoutes);  
app.use('/api/todos', TodoRoutes);
app.use('/api/users/:id', UserRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 