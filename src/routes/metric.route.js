const express = require('express');

const {
  createMetric,
  getMetricsByType,
  getMetricsForDrawChart,
} = require('../app/controllers/metric.controller');
const {
  validationCreateMetric,
  validationGetMetricByType,
  validationGetMetricsForDrawChart,
} = require('../app/middlewares/validation.middleware');

const router = express.Router();

router.post('/', validationCreateMetric, createMetric);
router.get('/chart', validationGetMetricsForDrawChart, getMetricsForDrawChart);
router.get('/', validationGetMetricByType, getMetricsByType);

module.exports = router;
