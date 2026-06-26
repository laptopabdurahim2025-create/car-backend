// middleware/errorHandler.js
// Markazlashtirilgan xatoliklarni boshqarish middleware
// Barcha xatoliklar shu yerdan o'tadi va foydalanuvchiga chiroyli javob qaytaradi

/**
 * errorHandler — Global error handling middleware
 * @param {Error} err — Xatolik obyekti
 * @param {Request} req — So'rov obyekti
 * @param {Response} res — Javob obyekti
 * @param {Function} next — Keyingi middleware
 */
const errorHandler = (err, req, res, next) => {
  // Xatolikni konsolga chiqarish (development uchun)
  console.error("❌ Xatolik:", err.message);

  // Default xatolik kodi va xabar
  let statusCode = err.statusCode || 500;
  let message = err.message || "Serverda ichki xatolik yuz berdi";

  // Mongoose Validation Error (noto'g'ri ma'lumot kiritilganda)
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Barcha validation xatolarini birlashtirish
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join(". ");
  }

  // Mongoose CastError (noto'g'ri ID format)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Noto'g'ri ID formati: ${err.value}`;
  }

  // Mongoose Duplicate Key Error (takroriy ma'lumot)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `${field} maydoni allaqachon mavjud`;
  }

  // Xatolik javobini qaytarish
  res.status(statusCode).json({
    success: false,
    message: message,
    // Development rejimda stack trace ko'rsatish
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;