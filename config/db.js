// config/db.js
// MongoDB Atlas bilan ulanishni boshqaruvchi fayl

const mongoose = require("mongoose");

/**
 * connectDB — MongoDB Atlas ga ulanish funksiyasi
 * Mongoose kutubxonasi orqali ulanadi
 * Agar ulanish muvaffaqiyatsiz bo'lsa, server to'xtaydi
 */
const connectDB = async () => {
  try {
    // MongoDB Atlas ga ulanish
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Muvaffaqiyatli ulanish haqida xabar
    console.log(`✅ MongoDB Atlas ulandi: ${conn.connection.host}`);
    console.log(`📦 Database nomi: ${conn.connection.name}`);
  } catch (error) {
    // Xatolik yuz berganda
    console.error(`❌ MongoDB ulanish xatosi: ${error.message}`);

    // Serverni to'xtatish (1 — xatolik bilan chiqish)
    process.exit(1);
  }
};

module.exports = connectDB;