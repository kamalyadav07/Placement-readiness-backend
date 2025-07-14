const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dsaRoutes = require("./routes/dsaRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// Connect MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Auth routes
app.use("/api/auth", authRoutes);

// ✅ DSA routes now mounted at /api/dsa
app.use("/api/dsa", dsaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
