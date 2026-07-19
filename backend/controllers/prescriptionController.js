const mongoose = require("mongoose");
const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const {
  normalizeMedicines,
  validateMedicines,
} = require("../utils/medicineUtils");

// Confirms the patient exists and belongs to the logged-in user before
// allowing a prescription to be attached to it.
const assertPatientOwnership = async (patientId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return null;
  }
  return Patient.findOne({ _id: patientId, user: userId });
};

const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorName, doctorAddress, medicines, notes } =
      req.body || {};

    const patient = await assertPatientOwnership(patientId, req.user.id);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    const normalizedMedicines = normalizeMedicines(medicines);
    const medicineError = validateMedicines(normalizedMedicines);

    if (medicineError) {
      return res.status(400).json({ success: false, message: medicineError });
    }

    const prescription = await Prescription.create({
      user: req.user.id,
      patient: patientId,
      doctorName: String(doctorName || "").trim(),
      doctorAddress: String(doctorAddress || "").trim(),
      medicines: normalizedMedicines,
      notes: String(notes || "").trim(),
      prescriptionDate: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: prescription,
      message: "Prescription saved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save prescription.",
      error: error.message,
    });
  }
};

const getLatestForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await assertPatientOwnership(patientId, req.user.id);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    const latest = await Prescription.findOne({
      patient: patientId,
      user: req.user.id,
    }).sort({ prescriptionDate: -1 });

    return res.status(200).json({ success: true, data: latest });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest prescription.",
      error: error.message,
    });
  }
};

const getAllForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await assertPatientOwnership(patientId, req.user.id);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    const prescriptions = await Prescription.find({
      patient: patientId,
      user: req.user.id,
    }).sort({ prescriptionDate: -1 });

    return res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription history.",
      error: error.message,
    });
  }
};

module.exports = { createPrescription, getLatestForPatient, getAllForPatient };
