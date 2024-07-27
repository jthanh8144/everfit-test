const { METRIC_TYPE, TEMPERATURE_UNIT, CHART_QUERY } = require('./enum');

const validateMetricType = (type) => Object.values(METRIC_TYPE).includes(type);

const convertDistance = (value, fromUnit, toUnit) => {
  const conversionFactors = {
    meter: 1,
    centimeter: 100,
    inch: 39.3701,
    feet: 3.28084,
    yard: 1.09361,
  };
  const valueInMeters = value / conversionFactors[fromUnit];
  return valueInMeters * conversionFactors[toUnit];
};

const convertTemperature = (value, fromUnit, toUnit) => {
  if (fromUnit === TEMPERATURE_UNIT.C) {
    if (toUnit === TEMPERATURE_UNIT.F) {
      return (value * 9) / 5 + 32;
    }
    if (toUnit === TEMPERATURE_UNIT.K) {
      return value + 273.15;
    }
  }
  if (fromUnit === TEMPERATURE_UNIT.F) {
    if (toUnit === TEMPERATURE_UNIT.C) {
      return ((value - 32) * 5) / 9;
    }
    if (toUnit === TEMPERATURE_UNIT.K) {
      return ((value - 32) * 5) / 9 + 273.15;
    }
  }
  if (fromUnit === TEMPERATURE_UNIT.K) {
    if (toUnit === TEMPERATURE_UNIT.C) {
      return value - 273.15;
    }
    if (toUnit === TEMPERATURE_UNIT.F) {
      return ((value - 273.15) * 9) / 5 + 32;
    }
  }
  throw new Error('convertTemperature error');
};

const transformMetrics = (metrics, type, convertTo) => {
  if (convertTo) {
    metrics.forEach((metric) => {
      if (type === METRIC_TYPE.Distance && metric.unit !== convertTo) {
        metric.value = convertDistance(metric.value, metric.unit, convertTo);
      } else if (type === METRIC_TYPE.Temperature && metric.unit !== convertTo) {
        metric.value = convertTemperature(metric.value, metric.unit, convertTo);
      }
      metric.unit = convertTo;
    });
  }
};

const splitNumberAndString = (period) => {
  const regex = /^(\d+)(\D+)$/;
  const match = period.match(regex);

  if (match) {
    return {
      number: +match[1],
      unit: match[2],
    };
  } else {
    throw new Error('Input string format is incorrect');
  }
};

const calculateDateRange = (period) => {
  const { number, unit } = period;
  const endDate = new Date();
  const startDate = new Date();
  switch (unit) {
    case CHART_QUERY.Week:
    case CHART_QUERY.Weeks:
      startDate.setDate(startDate.getDate() - 7 * number);
      break;
    case CHART_QUERY.Month:
    case CHART_QUERY.Months:
      startDate.setMonth(startDate.getMonth() - 1 * number);
      break;
  }
  return { startDate, endDate };
};

module.exports = {
  validateMetricType,
  convertDistance,
  convertTemperature,
  transformMetrics,
  splitNumberAndString,
  calculateDateRange,
};
