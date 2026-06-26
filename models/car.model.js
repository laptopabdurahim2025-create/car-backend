// models/car.model.js
// Mashina (Car) uchun Mongoose modeli (schema)
// Bu fayl MongoDB da qanday ma'lumot saqlanishini belgilaydi

const mongoose = require("mongoose");

/**
 * carSchema — Mashina ma'lumotlari sxemasi
 * Har bir maydon uchun turi, majburiyligi va default qiymatlari belgilangan
 */
const carSchema = new mongoose.Schema(
  {
    // Mashina nomi — majburiy maydon
    carName: {
      type: String,
      required: [true, "Mashina nomi kiritilishi shart"],
      trim: true, // Bosh va oxiridagi bo'sh joylarni olib tashlash
      maxlength: [100, "Mashina nomi 100 belgidan oshmasin"],
    },

    // Mashina rangi — majburiy maydon
    color: {
      type: String,
      required: [true, "Mashina rangi kiritilishi shart"],
      trim: true,
      maxlength: [50, "Rang nomi 50 belgidan oshmasin"],
    },

    // Ishlab chiqarilgan yili — majburiy maydon
    manufacturingYear: {
      type: Number,
      required: [true, "Ishlab chiqarilgan yil kiritilishi shart"],
      min: [1886, "Yil 1886 dan kam bo'lishi mumkin emas"], // Birinchi avtomobil yili
      max: [
        new Date().getFullYear() + 1,
        "Yil kelgusi yildan katta bo'lishi mumkin emas",
      ],
    },

    // Yurgan masofasi (km yoki mi)
    mileage: {
      type: String,
      required: [true, "Yurgan masofa kiritilishi shart"],
      trim: true,
    },

    // Mashina rasmi URL manzili
    imageUrl: {
      type: String,
      required: [true, "Rasm URL manzili kiritilishi shart"],
      trim: true,
    },

    // Ko'rishlar soni — default 0
    viewCount: {
      type: Number,
      default: 0,
      min: [0, "Ko'rishlar soni manfiy bo'lishi mumkin emas"],
    },
  },
  {
    // Yaratilgan va yangilangan vaqtni avtomatik qo'shish
    timestamps: true,
  }
);

// Modelni eksport qilish
// "Car" — MongoDB dagi collection nomi "cars" bo'ladi (avtomatik ko'plik)
module.exports = mongoose.model("Car", carSchema);