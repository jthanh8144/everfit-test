const {
  validationUserId,
} = require('../app/middlewares/validation.middleware');

const metricRoute = require('./metric.route');

async function useRouter(app) {
  app.use('/api/metrics', validationUserId, metricRoute);
}

module.exports = { useRouter };
