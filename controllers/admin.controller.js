const User = require("../models/user.model");
const Car = require("../models/car.model");

// Barcha userlarni olish
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Userni ban qilish
const banUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { banReason } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin foydalanuvchini ban qilib bo'lmaydi",
      });
    }

    user.isBanned = true;
    user.banReason = banReason || "Qoidalarni buzganlik";
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.username} banlandi`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Userni unban qilish
const unbanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    user.isBanned = false;
    user.banReason = "";
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.username} bandan chiqarildi`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Userga admin role berish
const makeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.username} admin qilindi`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Admin roleni olib tashlash
const removeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    if (user.username === "admin") {
      return res.status(400).json({
        success: false,
        message: "Asosiy admin roleni olib bo'lmaydi",
      });
    }

    user.role = "user";
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.username} admin emas`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Userni o'chirish
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    if (user.role === "admin" && user.username === "admin") {
      return res.status(400).json({
        success: false,
        message: "Asosiy adminni o'chirib bo'lmaydi",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `${user.username} o'chirildi`,
    });
  } catch (error) {
    next(error);
  }
};

// Foydalanuvchi parolini almashtirish (admin)
const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Yangi parol kamida 6 belgi bo'lishi kerak",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.username} ning paroli muvaffaqiyatli o'zgartirildi`,
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard statistika
const getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const adminUsers = await User.countDocuments({ role: "admin" });
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentCars = await Car.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCars,
        bannedUsers,
        adminUsers,
        recentUsers,
        recentCars,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  banUser,
  unbanUser,
  makeAdmin,
  removeAdmin,
  deleteUser,
  resetUserPassword,
  getDashboard,
};
