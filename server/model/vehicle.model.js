const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    // vehicleNo: String,
    // eNo: String,
    // surveyDate: Date,
    // riDate: Date,
    // location: String
  vehicleNo: { type: String, required: true },
  eNo: { type: String, default: null },
  surveyDate: { type: Date, required: true },
  riDate: { type: Date, default: null },
  location: { type: String, default: 'Unknown' }
});

const vehicleModel = mongoose.model('vehicle-registrations',vehicleSchema);

module.exports = vehicleModel;