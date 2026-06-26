const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

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

// MUHIM: siz xohlagan ko‘rinish
app.use("/api/v1", require("./routes/car.route"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Car backend ishlayapti",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Car backend running on port ${PORT}`);
});
