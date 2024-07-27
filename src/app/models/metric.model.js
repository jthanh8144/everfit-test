const { Schema, model } = require('mongoose');
const { METRIC_TYPE } = require('../../utils/enum');

const MetricSchema = new Schema(
  {
    _id: { type: Schema.ObjectId, required: true, auto: true },
    type: { type: String, enum: Object.values(METRIC_TYPE), required: true },
    date: { type: Date, default: Date.now, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { collection: 'metrics', timestamps: true }
);

const Metric = model('Metric', MetricSchema);

module.exports = { Metric };
