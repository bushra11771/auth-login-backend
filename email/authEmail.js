const { transporter } = require('../config/Nodemailer');
const consoleLogger = console; // or use the winston logger if you created it

class EmailService {
  constructor() {
    this.transporter = transporter;
  }

  async sendNewTodoEmail(userEmail, todo, userName = 'User') {
    const mailOptions = {
      from: `"Todo App" <${process.env.AUTH_EMAIL}>`,
      to: userEmail,
      subject: `New Todo: ${todo.title}`,
      html: `
        <h1>New Todo Added</h1>
        <p>Hello ${userName},</p>
        <p>You've added a new todo:</p>
        <div style="background:#f5f5f5; padding:10px; margin:10px 0;">
          <h3>${todo.title}</h3>
          <p>${todo.description || 'No description'}</p>
          ${todo.dueDate ? `<p>Due: ${new Date(todo.dueDate).toLocaleString()}</p>` : ''}
        </div>
        <p>Thank you for using our service!</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      consoleLogger.info(`Email sent to ${userEmail}`);
      return info;
    } catch (error) {
      consoleLogger.error(`Failed to send email to ${userEmail}:`, error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();