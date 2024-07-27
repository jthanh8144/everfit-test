const { Metric } = require('../models/metric.model');
const {
  transformMetrics,
  calculateDateRange,
} = require('../../utils/function');

async function createMetric(req, res, next) {
  try {
    const { type, date, value, unit } = req.body;

    const metric = new Metric({
      date: new Date(date),
      type,
      value,
      unit,
      userId: req.userId,
    });
    await metric.save();

    res.status(201).json(metric);
  } catch (e) {
    next(e);
  }
}

async function getMetricsByType(req, res, next) {
  try {
    const { type, convertTo } = req.query;

    const metrics = await Metric.find({ type, userId: req.userId })
      .sort({ date: 1, createdAt: 1 })
      .exec();
    transformMetrics(metrics, type, convertTo);

    res.json(metrics);
  } catch (e) {
    next(e);
  }
}

async function getMetricsForDrawChart(req, res, next) {
  try {
    const { type, convertTo } = req.query;
    const { startDate, endDate } = calculateDateRange(req.period);

    const metrics = await Metric.aggregate([
      {
        $match: {
          userId: req.userId,
          type,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $sort: { date: 1, createdAt: 1 },
      },
      {
        $group: {
          _id: '$date',
          latestMetric: { $last: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$latestMetric' },
      },
    ]);
    transformMetrics(metrics, type, convertTo);

    res.json(metrics);
  } catch (e) {
    next(e);
  }
}

module.exports = { createMetric, getMetricsByType, getMetricsForDrawChart };
