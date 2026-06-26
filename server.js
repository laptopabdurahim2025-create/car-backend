// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// .env fayldan o'zgaruvchilarni yuklash
dotenv.config();

const app = express();

// ========== Middleware ==========
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== Routes ==========
app.use("/api/v1", require("./routes/car.route"));

// ========== Asosiy route ==========
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚗 Car CRUD API serveri ishlayapti!",
    endpoints: {
      allCars: "GET /api/v1/cars",
      singleCar: "GET /api/v1/cars/:id",
      createCar: "POST /api/v1/cars",
      updateCar: "PUT /api/v1/cars/:id",
      deleteCar: "DELETE /api/v1/cars/:id",
    },
  });
});

// ========== 404 Route ==========
// ⚠️ Express 5.x da "*" o'rniga "{*path}" ishlatiladi!
app.use("/{*path}", (req, res) => {
  res.status(404).json({
    success: false,
    message: `❌ ${req.originalUrl} yo'nalishi topilmadi`,
  });
});

// ========== Global Error Handler ==========
app.use(errorHandler);

// ========== Serverni ishga tushirish ==========
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server ishga tushdi!`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📋 API: http://localhost:${PORT}/api/v1/cars`);
      console.log(`🔧 Rejim: ${process.env.NODE_ENV || "development"}\n`);
    });
  } catch (error) {
    console.error("❌ Server ishga tushmadi:", error.message);
    process.exit(1);
  }
};

startServer();
