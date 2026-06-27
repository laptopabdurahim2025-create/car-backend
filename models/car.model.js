const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    carName: {
      type: String,
      required: [true, "Mashina nomi kiritilishi shart"],
      trim: true,
      maxlength: [100, "Mashina nomi 100 belgidan oshmasin"],
    },
    color: {
      type: String,
      required: [true, "Mashina rangi kiritilishi shart"],
      trim: true,
    },
    manufacturingYear: {
      type: Number,
      required: [true, "Ishlab chiqarilgan yil kiritilishi shart"],
      min: [1886, "Yil 1886 dan kam bo'lishi mumkin emas"],
      max: [new Date().getFullYear() + 1, "Yil noto'g'ri"],
    },
    mileage: {
      type: String,
      required: [true, "Yurgan masofa kiritilishi shart"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Rasm URL manzili kiritilishi shart"],
      trim: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Car", carSchema);
