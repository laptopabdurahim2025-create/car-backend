const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username kiritilishi shart"],
      unique: true,
      trim: true,
      minlength: [3, "Username kamida 3 belgi bo'lishi kerak"],
      maxlength: [30, "Username 30 belgidan oshmasin"],
    },
    email: {
      type: String,
      required: [true, "Email kiritilishi shart"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email formati noto'g'ri"],
    },
    password: {
      type: String,
      required: [true, "Parol kiritilishi shart"],
      minlength: [6, "Parol kamida 6 belgi bo'lishi kerak"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: "",
    },
    carsAdded: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Parolni saqlashdan oldin hash qilish
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Parolni tekshirish
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
