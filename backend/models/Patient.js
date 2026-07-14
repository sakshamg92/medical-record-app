const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    dose: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      index: true,
    },
    mobile: {
      type: String,
      trim: true,
      index: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    doctorName: {
      type: String,
      trim: true,
      default: '',
    },
    doctorAddress: {
      type: String,
      trim: true,
      default: '',
    },
    disease: {
      type: String,
      trim: true,
      default: '',
    },
    medicines: {
      type: [medicineSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

patientSchema.index({ patientName: 1 });
patientSchema.index({ mobile: 1 });

module.exports = mongoose.model('Patient', patientSchema);
