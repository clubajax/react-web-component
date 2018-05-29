process.env.API = process.env.API || 'dev';
global.isProd = false;
const config = require('./webpack.config');

module.exports = config;
