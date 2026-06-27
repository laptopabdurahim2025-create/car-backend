const Car = require("../models/car.model");

// Barcha mashinalar
const getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find()
      .populate("addedBy", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      message: "Barcha mashinalar muvaffaqiyatli olindi",
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};

// Bitta mashina
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate(
      "addedBy",
      "username avatar",
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Mashina topilmadi",
      });
    }

    car.viewCount += 1;
    await car.save();

    res.status(200).json({
      success: true,
      message: "Mashina muvaffaqiyatli topildi",
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// Yangi mashina
const createCar = async (req, res, next) => {
  try {
    const { carName, color, manufacturingYear, mileage, imageUrl, viewCount } =
      req.body;

    const newCar = await Car.create({
      carName,
      color,
      manufacturingYear,
      mileage,
      imageUrl,
      viewCount: viewCount || 0,
      addedBy: req.user ? req.user._id : null,
    });

    // User carsAdded ni oshirish
    if (req.user) {
      req.user.carsAdded += 1;
      await req.user.save();
    }

    const populatedCar = await Car.findById(newCar._id).populate(
      "addedBy",
      "username avatar",
    );

    res.status(201).json({
      success: true,
      message: "Yangi mashina muvaffaqiyatli qo'shildi",
      data: populatedCar,
    });
  } catch (error) {
    next(error);
  }
};

// Mashinani yangilash
const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Mashina topilmadi",
      });
    }

    // Faqat admin yoki qo'shgan odam o'zgartira oladi
    if (req.user) {
      if (
        req.user.role !== "admin" &&
        car.addedBy &&
        car.addedBy.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Siz faqat o'zingiz qo'shgan mashinani o'zgartira olasiz",
        });
      }
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("addedBy", "username avatar");

    res.status(200).json({
      success: true,
      message: "Mashina muvaffaqiyatli yangilandi",
      data: updatedCar,
    });
  } catch (error) {
    next(error);
  }
};

// Mashinani o'chirish
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Mashina topilmadi",
      });
    }

    // Faqat admin yoki qo'shgan odam o'chira oladi
    if (req.user) {
      if (
        req.user.role !== "admin" &&
        car.addedBy &&
        car.addedBy.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Siz faqat o'zingiz qo'shgan mashinani o'chira olasiz",
        });
      }
    }

    await Car.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Mashina muvaffaqiyatli o'chirildi",
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar };
