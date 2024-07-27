require('dotenv').require();

const express = require('express');
const cors = require('cors');
const createError = require('http-errors');

const { connect: connectDB } = require('./configs/db');
const { useRouter } = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();
useRouter(app);

app.use(function (_req, _res, next) {
  next(createError(404));
});

app.use(function (err, req, res, _next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

app.listen(process.env.APP_PORT ?? 3000);
