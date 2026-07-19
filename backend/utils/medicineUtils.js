const toNonNegativeNumber = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return 0;
  return num;
};

const normalizeMedicines = (medicines) => {
  if (!Array.isArray(medicines)) {
    return [];
  }

  return medicines
    .map((item = {}) => {
      const name = String(item.name || "").trim();
      const qty = toNonNegativeNumber(item.qty);
      const rate = toNonNegativeNumber(item.rate);
      const total = qty * rate;

      return { name, qty, rate, total };
    })
    .filter((item) => item.name || item.qty || item.rate || item.total);
};

const validateMedicines = (medicines) => {
  for (const medicine of medicines || []) {
    if (!medicine.name) {
      return "Medicine name is required for each medicine row.";
    }
    if (medicine.qty < 0 || medicine.rate < 0) {
      return "Medicine qty and rate must be non-negative.";
    }
  }
  return null;
};

module.exports = { toNonNegativeNumber, normalizeMedicines, validateMedicines };
