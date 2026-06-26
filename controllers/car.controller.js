// controllers/car.controller.js
// Mashina (Car) uchun barcha CRUD operatsiyalari
// Har bir funksiya bitta endpointni boshqaradi

const Car = require("../models/car.model");

/**
 * @desc    Barcha mashinalarni olish
 * @route   GET /api/v1/cars
 * @access  Public (ochiq)
 */
const getAllCars = async (req, res, next) => {
  try {
    // Barcha mashinalarni bazadan olish (eng yangilari birinchi)
    const cars = await Car.find().sort({ createdAt: -1 });

    // Muvaffaqiyatli javob
    res.status(200).json({
      success: true,
      count: cars.length,
      message: "Barcha mashinalar muvaffaqiyatli olindi",
      data: cars,
    });
  } catch (error) {
    // Xatolikni middleware ga uzatish
    next(error);
  }
};

/**
 * @desc    Bitta mashinani ID bo'yicha olish
 * @route   GET /api/v1/cars/:id
 * @access  Public (ochiq)
 */
const getCarById = async (req, res, next) => {
  try {
    // ID bo'yicha mashinani topish
    const car = await Car.findById(req.params.id);

    // Agar mashina topilmasa
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Mashina topilmadi",
      });
    }

    // Ko'rishlar sonini 1 ga oshirish
    car.viewCount += 1;
    await car.save();

    // Muvaffaqiyatli javob
    res.status(200).json({
      success: true,
      message: "Mashina muvaffaqiyatli topildi",
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Yangi mashina qo'shish
 * @route   POST /api/v1/cars
 * @access  Public (ochiq)
 */
const createCar = async (req, res, next) => {
  try {
    // Request body dan ma'lumotlarni olish
    const { carName, color, manufacturingYear, mileage, imageUrl, viewCount } =
      req.body;

    // Yangi mashina yaratish
    const newCar = await Car.create({
      carName,
      color,
      manufacturingYear,
      mileage,
      imageUrl,
      viewCount: viewCount || 0, // Agar berilmasa 0 bo'ladi
    });

    // Muvaffaqiyatli javob (201 — yaratildi)
    res.status(201).json({
      success: true,
      message: "Yangi mashina muvaffaqiyatli qo'shildi",
      data: newCar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mashinani yangilash (tahrirlash)
 * @route   PUT /api/v1/cars/:id
 * @access  Public (ochiq)
 */
const updateCar = async (req, res, next) => {
  try {
    // ID bo'yicha mashinani topib yangilash
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id, // Qaysi mashinani yangilash
      req.body, // Yangi ma'lumotlar
      {
        new: true, // Yangilangan versiyani qaytarish
        runValidators: true, // Validatsiyani bajarish
      }
    );

    // Agar mashina topilmasa
    if (!updatedCar) {
      return res.status(404).json({
        success: false,
        message: "Yangilanishi kerak bo'lgan mashina topilmadi",
      });
    }

    // Muvaffaqiyatli javob
    res.status(200).json({
      success: true,
      message: "Mashina muvaffaqiyatli yangilandi",
      data: updatedCar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mashinani o'chirish
 * @route   DELETE /api/v1/cars/:id
 * @access  Public (ochiq)
 */
const deleteCar = async (req, res, next) => {
  try {
    // ID bo'yicha mashinani topib o'chirish
    const deletedCar = await Car.findByIdAndDelete(req.params.id);

    // Agar mashina topilmasa
    if (!deletedCar) {
      return res.status(404).json({
        success: false,
        message: "O'chirilishi kerak bo'lgan mashina topilmadi",
      });
    }

    // Muvaffaqiyatli javob
    res.status(200).json({
      success: true,
      message: "Mashina muvaffaqiyatli o'chirildi",
      data: deletedCar,
    });
  } catch (error) {
    next(error);
  }
};

// Barcha funksiyalarni eksport qilish
module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};