const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  banUser,
  unbanUser,
  makeAdmin,
  removeAdmin,
  deleteUser,
  resetUserPassword,
  getDashboard,
} = require("../controllers/admin.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/admin/dashboard", protect, adminOnly, getDashboard);
router.get("/admin/users", protect, adminOnly, getAllUsers);
router.put("/admin/users/:id/ban", protect, adminOnly, banUser);
router.put("/admin/users/:id/unban", protect, adminOnly, unbanUser);
router.put("/admin/users/:id/make-admin", protect, adminOnly, makeAdmin);
router.put("/admin/users/:id/remove-admin", protect, adminOnly, removeAdmin);
router.put(
  "/admin/users/:id/reset-password",
  protect,
  adminOnly,
  resetUserPassword,
);
router.delete("/admin/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
