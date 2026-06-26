// routes/car.route.js
// Mashina (Car) uchun API yo'nalishlari
// Har bir endpoint tegishli controller funksiyasiga yo'naltiriladi

const express = require("express");
const router = express.Router();

// Controller funksiyalarni import qilish
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");

/**
 * /cars yo'nalishi
 * GET  /api/v1/cars     — Barcha mashinalarni olish
 * POST /api/v1/cars     — Yangi mashina qo'shish
 */
router.route("/cars").get(getAllCars).post(createCar);

/**
 * /cars/:id yo'nalishi
 * GET    /api/v1/cars/:id  — Bitta mashinani olish
 * PUT    /api/v1/cars/:id  — Mashinani yangilash
 * DELETE /api/v1/cars/:id  — Mashinani o'chirish
 */
router.route("/cars/:id").get(getCarById).put(updateCar).delete(deleteCar);

module.exports = router;
