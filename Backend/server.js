const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");          // ← NEW
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ── (NEW)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ── Mongoose Models ── (NEW)
const bookingSchema = new mongoose.Schema({
  carName:        String,
  carImage:       String,
  userEmail:      String,
  name:           String,
  email:          String,
  address:        String,
  pickupLocation: String,
  pickupState:    String,
  pickupLat:      Number,
  pickupLng:      Number,
  pickup:         String,
  returnDate:     String,
  days:           Number,
  price:          Number,
  discountedPrice:Number,
  createdAt:      { type: Date, default: Date.now },
});
const Booking = mongoose.model("Booking", bookingSchema);

const userSchema = new mongoose.Schema({
  name:      String,
  email:     { type: String, unique: true },
  phone:     String,
  password:  String,
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

// ─────────────────────────────────────────────
// EXISTING OTP LOGIC — UNCHANGED
// ─────────────────────────────────────────────
const otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = generateOTP();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"QuickRide" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your QuickRide OTP",
      html: `
        <h2>Your OTP Code</h2>
        <p>Use this OTP to login to QuickRide:</p>
        <h1 style="color:#e63946; letter-spacing:8px">${otp}</h1>
        <p>This OTP expires in <b>5 minutes</b>.</p>
      `,
    });
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: "OTP not found. Request a new one." });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired. Request a new one." });
  }
  if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  delete otpStore[email];
  res.json({ message: "OTP verified successfully" });
});

// ─────────────────────────────────────────────
// NEW MONGODB ROUTES
// ─────────────────────────────────────────────

// Save a booking
app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Booking saved", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to save booking", error: err.message });
  }
});

// Get all bookings for a user by email
app.get("/api/bookings/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
});

// Register a user
app.post("/api/users/register", async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: "User already exists" });
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Get user by email (for login check)
app.get("/api/users/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));