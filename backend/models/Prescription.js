const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    qty: { type: Number, required: true, min: 0, default: 0 },
    rate: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false },
);

const prescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorName: {
      type: String,
      trim: true,
      default: "",
    },
    doctorAddress: {
      type: String,
      trim: true,
      default: "",
    },
    medicines: {
      type: [medicineSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    prescriptionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

prescriptionSchema.index({ patient: 1, prescriptionDate: -1 });
prescriptionSchema.index({ user: 1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);
