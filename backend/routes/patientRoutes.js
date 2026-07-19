const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPatients,
  getPatientById,
  searchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const router = express.Router();

router.use(authMiddleware);

router.get("/search", searchPatients);
router.get("/", getPatients);
router.get("/:id", getPatientById);
router.post("/", createPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

module.exports = router;

// const express = require('express');
// const {
//   getPatients,
//   getPatientById,
//   searchPatients,
//   createPatient,
//   updatePatient,
//   deletePatient,
// } = require('../controllers/patientController');

// const router = express.Router();

// router.get('/search', searchPatients);
// router.get('/', getPatients);
// router.get('/:id', getPatientById);
// router.post('/', createPatient);
// router.put('/:id', updatePatient);
// router.delete('/:id', deletePatient);

// module.exports = router;
