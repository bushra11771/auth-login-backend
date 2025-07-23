const serverlessExpress = require('@vendia/serverless-express');
const app = require('../server'); // Import your express app

module.exports = serverlessExpress({ app });
