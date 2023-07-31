/*  func-names: "off" */
const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config/database');


config();
app.use(express.json());
app.use(cors());
app.use('/user', require('./src/user/user.routes'));
app.use('/menu', require('./src/menu/menu.routes'));
app.use('/business', require('./src/business/business.routes'));
app.use('/order', require('./src/order/order.routes'));



module.exports = app;