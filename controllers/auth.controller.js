const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Token yaratish
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Tekshirish
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Bu email allaqachon ro'yxatdan o'tgan"
            : "Bu username allaqachon band",
      });
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz!",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { login: loginField, password } = req.body;

    if (!loginField || !password) {
      return res.status(400).json({
        success: false,
        message: "Login va parol kiritilishi shart",
      });
    }

    // Email yoki username bilan kirish
    const user = await User.findOne({
      $or: [{ email: loginField }, { username: loginField }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Login yoki parol noto'g'ri",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Login yoki parol noto'g'ri",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: `Siz banlangansiz. Sabab: ${user.banReason || "Ko'rsatilmagan"}`,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz!",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isBanned: user.isBanned,
        carsAdded: user.carsAdded,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Profil olish
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Profilni yangilash
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profil yangilandi",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };