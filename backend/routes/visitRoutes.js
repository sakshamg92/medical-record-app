const express = require("express");
const {
  createVisit,
  getAllForPatient,
  getVisitById,
} = require("../controllers/visitController");

const router = express.Router();

router.post("/", createVisit);
router.get("/patient/:patientId", getAllForPatient);
router.get("/:id", getVisitById);

module.exports = router;
