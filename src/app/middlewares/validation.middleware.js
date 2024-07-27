const {
  METRIC_TYPE,
  DISTANCE_UNIT,
  TEMPERATURE_UNIT,
  CHART_QUERY,
} = require('../../utils/enum');
const {
  validateMetricType,
  validateDistanceUnit,
  validateTemperatureUnit,
  splitNumberAndString,
} = require('../../utils/function');

async function validationUserId(req, res, next) {
  const userId = req.headers['user-id'];

  if (!userId) {
    res.status(400).json({
      message: `user-id is required in headers`,
    });
    return;
  }
  req.userId = userId;
  next();
}

async function validationCreateMetric(req, res, next) {
  try {
    const { type, date, value, unit } = req.body;

    if (!validateMetricType(type)) {
      res.status(400).json({
        message: `type should be in ${JSON.stringify(
          Object.values(METRIC_TYPE)
        )}`,
      });
      return;
    }
    if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)) {
      res.status(400).json({
        message: `date not in YYYY-MM-DD format`,
      });
      return;
    }
    if (typeof value !== 'number') {
      res.status(400).json({
        message: `value must be a number`,
      });
      return;
    }
    if (
      type === METRIC_TYPE.Distance &&
      !Object.values(DISTANCE_UNIT).includes(unit)
    ) {
      res.status(400).json({
        message: `unit should be in ${JSON.stringify(
          Object.values(DISTANCE_UNIT)
        )}`,
      });
      return;
    }
    if (
      type === METRIC_TYPE.Temperature &&
      !Object.values(TEMPERATURE_UNIT).includes(unit)
    ) {
      res.status(400).json({
        message: `unit should be in ${JSON.stringify(
          Object.values(TEMPERATURE_UNIT)
        )}`,
      });
      return;
    }
    next();
  } catch (e) {
    next(e);
  }
}

async function validationGetMetricByType(req, res, next) {
  const { type, convertTo } = req.query;

  if (!type) {
    res.status(400).json({
      message: `type is required in query`,
    });
    return;
  }

  if (!validateMetricType(type)) {
    res.status(400).json({
      message: `type should be in ${JSON.stringify(
        Object.values(METRIC_TYPE)
      )}`,
    });
    return;
  }

  if (convertTo) {
    if (
      type === METRIC_TYPE.Distance &&
      !Object.values(DISTANCE_UNIT).includes(convertTo)
    ) {
      res.status(400).json({
        message: `convertTo should be in ${JSON.stringify(
          Object.values(DISTANCE_UNIT)
        )}`,
      });
      return;
    }
    if (
      type === METRIC_TYPE.Temperature &&
      !Object.values(TEMPERATURE_UNIT).includes(convertTo)
    ) {
      res.status(400).json({
        message: `convertTo should be in ${JSON.stringify(
          Object.values(TEMPERATURE_UNIT)
        )}`,
      });
      return;
    }
  }

  next();
}

async function validationGetMetricsForDrawChart(req, res, next) {
  const { type, period } = req.query;

  if (!type || !period) {
    res.status(400).json({
      message: `type and period are required in query`,
    });
    return;
  }

  if (!validateMetricType(type)) {
    res.status(400).json({
      message: `type should be in ${JSON.stringify(
        Object.values(METRIC_TYPE)
      )}`,
    });
    return;
  }

  try {
    const { number, unit } = splitNumberAndString(period);
    if (!Object.values(CHART_QUERY).includes(unit)) {
      res.status(400).json({
        message: `period unit should be in ${JSON.stringify(
          Object.values(CHART_QUERY)
        )}`,
      });
      return;
    }
    req.period = { number, unit };
  } catch (e) {
    res.status(400).json({ message: e.message });
  }

  next();
}

module.exports = {
  validationUserId,
  validationCreateMetric,
  validationGetMetricByType,
  validationGetMetricsForDrawChart,
};
