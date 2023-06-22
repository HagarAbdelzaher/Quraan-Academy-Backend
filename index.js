/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const routes = require('./routes');

const mongourl = process.env.mongoUrl || 'mongodb://127.0.0.1:27017/quraan';
mongoose.connect(mongourl);
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;
  return res.status(error.statusCode).json({ error: error.toString() });
});

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
  console.log(`UP : 127.0.0.1:${Port}`);
});
