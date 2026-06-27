const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const User = require("./models/user.model");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://apiofcars.netlify.app",
      "https://abdurahim.maktab16.uz",
      "http://abdurahim.maktab16.uz",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", require("./routes/car.route"));
app.use("/api/v1", require("./routes/auth.route"));
app.use("/api/v1", require("./routes/admin.route"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Car CRUD API + Auth ishlayapti!",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Admin yaratish funksiyasi
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      await User.create({
        username: "admin",
        email: "admin@carcrud.com",
        password: "Abboud2012",
        role: "admin",
      });
      console.log("✅ Default admin yaratildi: admin / Abboud2012");
    } else {
      console.log("ℹ️ Admin allaqachon mavjud");
    }
  } catch (error) {
    console.error("Admin yaratishda xato:", error.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await createDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server ishga tushdi! Port: ${PORT}\n`);
    });
  } catch (error) {
    console.error("Server ishga tushmadi:", error.message);
    process.exit(1);
  }
};

startServer();
