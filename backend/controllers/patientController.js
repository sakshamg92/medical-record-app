const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const Visit = require("../models/Visit");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildPayload = (body) => ({
  patientName: String(body.patientName || "").trim(),
  mobile: String(body.mobile || "").trim(),
  address: String(body.address || "").trim(),
  disease: String(body.disease || "").trim(),
  notes: String(body.notes || "").trim(),
});

const validatePayload = (payload) => {
  if (!payload.patientName) {
    return "Patient name is required.";
  }
  return null;
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ user: req.user.id }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({ success: true, data: patients });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients.",
      error: error.message,
    });
  }
};

const searchPatients = async (req, res) => {
  try {
    const query = req.query?.q?.trim();

    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    const regex = new RegExp(escapeRegex(query), "i");
    const patients = await Patient.find({
      user: req.user.id,
      $or: [{ patientName: regex }, { mobile: regex }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, data: patients });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search patients.",
      error: error.message,
    });
  }
};

// Returns the patient along with their latest prescription and full visit
// history in a single response, so the details screen needs one call.
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid patient id." });
    }

    const patient = await Patient.findOne({ _id: id, user: req.user.id });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    const latestPrescription = await Prescription.findOne({
      patient: id,
      user: req.user.id,
    }).sort({ prescriptionDate: -1 });

    const visits = await Visit.find({ patient: id, user: req.user.id })
      .sort({ visitDate: -1 })
      .populate("prescription");

    return res.status(200).json({
      success: true,
      data: {
        patient,
        latestPrescription,
        visits,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient.",
      error: error.message,
    });
  }
};

const createPatient = async (req, res) => {
  try {
    const payload = buildPayload(req.body || {});
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const patient = await Patient.create({ ...payload, user: req.user.id });

    return res.status(201).json({
      success: true,
      data: patient,
      message: "Patient created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create patient.",
      error: error.message,
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid patient id." });
    }

    const payload = buildPayload(req.body || {});
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const patient = await Patient.findOneAndUpdate(
      { _id: id, user: req.user.id },
      payload,
      { new: true, runValidators: true },
    );

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    return res.status(200).json({
      success: true,
      data: patient,
      message: "Patient updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update patient.",
      error: error.message,
    });
  }
};

// Deleting a patient also removes their prescriptions and visits, so no
// orphaned records are left behind.
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid patient id." });
    }

    const patient = await Patient.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    await Prescription.deleteMany({ patient: id, user: req.user.id });
    await Visit.deleteMany({ patient: id, user: req.user.id });

    return res
      .status(200)
      .json({ success: true, message: "Patient deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete patient.",
      error: error.message,
    });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  searchPatients,
  createPatient,
  updatePatient,
  deletePatient,
};
