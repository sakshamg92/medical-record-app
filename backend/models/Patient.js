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

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
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
    disease: {
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
  },
  { timestamps: true },
);

patientSchema.index({ user: 1, patientName: 1 });
patientSchema.index({ user: 1, mobile: 1 });
// patientSchema.index({ patientName: 1 });
// patientSchema.index({ mobile: 1 });
// patientSchema.index({ user: 1 });

module.exports = mongoose.model("Patient", patientSchema);
// const mongoose = require("mongoose");

// const medicineSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     qty: { type: Number, required: true, min: 0, default: 0 },
//     rate: { type: Number, required: true, min: 0, default: 0 },
//     total: { type: Number, required: true, min: 0, default: 0 },
//   },
//   { _id: false },
// );

// const patientSchema = new mongoose.Schema(
//   {
//     patientName: {
//       type: String,
//       required: [true, "Patient name is required"],
//       trim: true,
//     },
//     mobile: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     address: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     doctorName: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     doctorAddress: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     disease: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     medicines: {
//       type: [medicineSchema],
//       default: [],
//     },
//     notes: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//   },
//   { timestamps: true },
// );

// patientSchema.index({ patientName: 1 });
// patientSchema.index({ mobile: 1 });

// module.exports = mongoose.model("Patient", patientSchema);
