const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Foydalanuvchini autentifikatsiya qilish
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Tizimga kiring. Token topilmadi.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: `Siz banlangansiz. Sabab: ${user.banReason || "Ko'rsatilmagan"}`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token yaroqsiz yoki muddati tugagan",
    });
  }
};

// Faqat admin uchun
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Faqat admin bu amalni bajara oladi",
    });
  }
  next();
};

module.exports = { protect, adminOnly };
