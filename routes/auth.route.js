const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/profile", protect, getProfile);
router.put("/auth/profile", protect, updateProfile);

module.exports = router;
