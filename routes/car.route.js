const express = require("express");
const router = express.Router();

const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");

router.route("/cars").get(getAllCars).post(createCar);
router.route("/cars/:id").get(getCarById).put(updateCar).delete(deleteCar);

module.exports = router;
