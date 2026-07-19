const express = require("express");
const {
  createPrescription,
  getLatestForPatient,
  getAllForPatient,
} = require("../controllers/prescriptionController");

const router = express.Router();

router.post("/", createPrescription);
router.get("/patient/:patientId/latest", getLatestForPatient);
router.get("/patient/:patientId", getAllForPatient);

module.exports = router;
