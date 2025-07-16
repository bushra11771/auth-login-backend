const nodemailer = require('nodemailer')

  console.log('AUTH_EMAIL:', process.env.AUTH_EMAIL);
  console.log('AUTH_PASS:', process.env.AUTH_PASS ? 'SET' : 'NOT SET');
module.exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
    
})