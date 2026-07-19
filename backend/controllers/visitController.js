const mongoose = require("mongoose");
const Visit = require("../models/Visit");
const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const {
  normalizeMedicines,
  validateMedicines,
} = require("../utils/medicineUtils");

const assertPatientOwnership = async (patientId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return null;
  }
  return Patient.findOne({ _id: patientId, user: userId });
};

const createVisit = async (req, res) => {
  try {
    const { patientId, prescriptionId, medicinesDispensed, notes, visitDate } =
      req.body || {};

    const patient = await assertPatientOwnership(patientId, req.user.id);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    if (!mongoose.Types.ObjectId.isValid(prescriptionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid prescription id." });
    }

    const prescription = await Prescription.findOne({
      _id: prescriptionId,
      patient: patientId,
      user: req.user.id,
    });

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found." });
    }

    const normalizedMedicines = normalizeMedicines(medicinesDispensed);
    const medicineError = validateMedicines(normalizedMedicines);

    if (medicineError) {
      return res.status(400).json({ success: false, message: medicineError });
    }

    const visit = await Visit.create({
      user: req.user.id,
      patient: patientId,
      prescription: prescriptionId,
      doctorNameSnapshot: prescription.doctorName,
      visitDate: visitDate ? new Date(visitDate) : new Date(),
      medicinesDispensed: normalizedMedicines,
      notes: String(notes || "").trim(),
    });

    return res.status(201).json({
      success: true,
      data: visit,
      message: "Visit recorded successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to record visit.",
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

    const visits = await Visit.find({ patient: patientId, user: req.user.id })
      .sort({ visitDate: -1 })
      .populate("prescription");

    return res.status(200).json({ success: true, data: visits });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch visit history.",
      error: error.message,
    });
  }
};

const getVisitById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid visit id." });
    }

    const visit = await Visit.findOne({ _id: id, user: req.user.id }).populate(
      "prescription",
    );

    if (!visit) {
      return res
        .status(404)
        .json({ success: false, message: "Visit not found." });
    }

    return res.status(200).json({ success: true, data: visit });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch visit.",
      error: error.message,
    });
  }
};

module.exports = { createVisit, getAllForPatient, getVisitById };
