const mongoose = require('mongoose');
const Patient = require('../models/Patient');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeMedicines = (medicines) => {
  if (!Array.isArray(medicines)) {
    return [];
  }

  return medicines
    .map((item = {}) => ({
      name: String(item.name || '').trim(),
      dose: String(item.dose || '').trim(),
    }))
    .filter((item) => item.name || item.dose);
};

const validatePayload = (payload) => {
  const patientName = payload?.patientName?.trim();

  if (!patientName) {
    return 'Patient name is required.';
  }

  return null;
};

const buildPayload = (body) => ({
  patientName: String(body.patientName || '').trim(),
  mobile: String(body.mobile || '').trim(),
  address: String(body.address || '').trim(),
  doctorName: String(body.doctorName || '').trim(),
  doctorAddress: String(body.doctorAddress || '').trim(),
  disease: String(body.disease || '').trim(),
  medicines: normalizeMedicines(body.medicines),
  notes: String(body.notes || '').trim(),
});

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch patients.',
      error: error.message,
    });
  }
};

const searchPatients = async (req, res) => {
  try {
    const query = req.query?.q?.trim();

    if (!query) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const regex = new RegExp(escapeRegex(query), 'i');
    const patients = await Patient.find({
      $or: [{ patientName: regex }, { mobile: regex }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to search patients.',
      error: error.message,
    });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient id.',
      });
    }

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch patient.',
      error: error.message,
    });
  }
};

const createPatient = async (req, res) => {
  try {
    const payload = buildPayload(req.body || {});
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const patient = await Patient.create(payload);

    return res.status(201).json({
      success: true,
      data: patient,
      message: 'Patient created successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create patient.',
      error: error.message,
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient id.',
      });
    }

    const payload = buildPayload(req.body || {});
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const patient = await Patient.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
      message: 'Patient updated successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update patient.',
      error: error.message,
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient id.',
      });
    }

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete patient.',
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
