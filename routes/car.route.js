const express = require("express");
const router = express.Router();
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");
const { protect } = require("../middleware/auth.middleware");

// Barcha ko'ra oladi, lekin qo'shish/o'zgartirish/o'chirish uchun login kerak
router.route("/cars").get(getAllCars).post(protect, createCar);

router
  .route("/cars/:id")
  .get(getCarById)
  .put(protect, updateCar)
  .delete(protect, deleteCar);

module.exports = router;
