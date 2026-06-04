# 🚗 QuickRide — Car Rental Web Application

<div align="center">

![QuickRide Banner](https://img.shields.io/badge/QuickRide-Car%20Rental-e63946?style=for-the-badge&logo=car&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=flat-square&logo=bootstrap)

**A full-stack car rental platform with OTP-based authentication, Razorpay/UPI payment integration, real-time map-based pickup location selection, and a complete admin dashboard.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Project Flow](#-project-flow)
- [Pages & Components](#-pages--components)
- [Backend API](#-backend-api)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Available Cars](#-available-cars)
- [Admin Panel](#-admin-panel)
- [Payment Integration](#-payment-integration)
- [Screenshots](#-screenshots)

---

## 🌟 Overview

**QuickRide** is a full-stack car rental web application built for the Indian market. Users can browse cars, select pickup locations from real cities (Delhi, Haryana, Uttar Pradesh), book for specific dates, and pay via Razorpay or UPI. The platform includes secure OTP-based login via email and a feature-rich admin dashboard for managing bookings and car inventory.

---

## ✨ Features

### 👤 User Features
- 🔐 **OTP-based Authentication** — Login via 6-digit OTP sent to email (valid for 5 minutes)
- 📝 **User Registration** — Sign up with name, email, phone, and password
- 🚘 **Browse Cars** — View all available cars with images and daily rates
- 🔍 **Car Details** — Full specs and details for each car
- 📍 **Location-based Booking** — Choose pickup from real locations across Delhi, Haryana, and Uttar Pradesh
- 🗺️ **Interactive Map** — Leaflet.js map shows the selected pickup point with a live marker
- 📅 **Date Selection** — Choose pickup and return dates; auto-calculates total rental days
- 💳 **Payment Gateway** — Razorpay online payment + UPI QR code option
- 📬 **Booking Confirmation** — Bookings saved to MongoDB with full details
- 📂 **View My Bookings** — Users can view all their past and current bookings
- 🚪 **Logout** — Session-based login with localStorage

### 🛠️ Admin Features
- 📊 **Admin Dashboard** — Overview of all bookings with stats
- ➕ **Add Car** — Add new cars to the fleet (name, price, image URL)
- ✏️ **Manage Cars** — Edit or delete existing cars
- 👁️ **View All Bookings** — See all bookings across all users

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router DOM v7 |
| **Styling** | Custom CSS-in-JS, Bootstrap 5, Google Fonts |
| **Maps** | Leaflet.js (OpenStreetMap tiles) |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas + Mongoose |
| **Authentication** | OTP via Nodemailer (Gmail SMTP) |
| **Payments** | Razorpay SDK + UPI QR Code |
| **Email** | Nodemailer |
| **State Management** | React useState / useEffect / localStorage |

---

## 📁 Project Structure

```
car-rental-project/
│
├── backend/                        # Express.js Backend
│   ├── server.js                   # Main server — all routes, MongoDB models
│   ├── package.json
│   └── .env                        # Environment variables (not committed)
│
├── public/
│   ├── index.html                  # Root HTML
│   └── manifest.json
│
├── src/
│   ├── App.js                      # Root component — routing + global state
│   ├── App.css                     # Global styles
│   ├── index.js                    # React DOM entry point
│   │
│   ├── data/
│   │   └── carsData.js             # Default car catalogue (6 cars)
│   │
│   ├── components/
│   │   ├── Navbar.js               # Top navigation bar
│   │   └── CarCard.js              # Car listing card component
│   │
│   ├── pages/
│   │   ├── Home.js                 # Landing page
│   │   ├── Cars.js                 # Car listing / browse page
│   │   ├── CarDetails.js           # Individual car details
│   │   ├── Booking.js              # Booking form with map
│   │   ├── Payment.js              # Payment page (Razorpay + UPI)
│   │   ├── Login.js                # OTP login page
│   │   ├── Register.js             # User registration page
│   │   └── ViewBookings.js         # User's booking history
│   │
│   └── admin/
│       ├── AdminDashboard.js       # Admin overview + all bookings
│       ├── AddCar.js               # Add new car form
│       └── ManageCars.js           # Edit/delete cars
│
└── package.json
```

---

## 🔄 Project Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

  1. HOME PAGE (/)
     └── Hero section, features, CTA → "Book Now" / "Browse Cars"

  2. CARS PAGE (/cars)
     └── Grid of all available cars (from localStorage or carsData.js)
         └── Click on a car → Car Details

  3. CAR DETAILS (/cardetails/:id)
     └── Full car info, price per day
         └── "Book Now" button → redirects to Booking (if logged in)
                                → redirects to Login (if not logged in)

  4. LOGIN (/login)
     ├── User enters email
     ├── OTP sent to email via backend (/send-otp)
     ├── User enters OTP → verified via backend (/verify-otp)
     └── On success → user fetched from MongoDB → saved to localStorage
         └── Redirect back to Booking

  5. REGISTER (/register)
     └── New user fills name, email, phone, password
         └── Saved to MongoDB via POST /api/users/register

  6. BOOKING PAGE (/booking)
     ├── Car info passed via router state
     ├── User fills: Name, Email, Address
     ├── Selects: State → Pickup Location (lat/lng populated)
     ├── Leaflet Map shows selected pickup point
     ├── Selects: Pickup Date, Return Date
     ├── Auto-calculates: Days × Price = Total
     └── "Proceed to Payment" → navigates to Payment with all booking data

  7. PAYMENT PAGE (/payment)
     ├── Displays booking summary (car, dates, amount)
     ├── Option A: Razorpay Online Payment
     │   └── Razorpay popup → on success → booking saved to MongoDB
     ├── Option B: UPI QR Code
     │   └── Shows QR code + UPI ID → manual confirmation → booking saved
     └── On success → Booking saved via POST /api/bookings
                    → Success screen shown

  8. VIEW BOOKINGS (/bookings)
     └── Fetches all bookings for logged-in user via GET /api/bookings/:email
         └── Displays booking cards with full details

┌─────────────────────────────────────────────────────────────────┐
│                       ADMIN JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

  /admin          → AdminDashboard  (all bookings overview)
  /addcar         → AddCar          (add new car to fleet)
  /managecars     → ManageCars      (edit / delete cars)
```

---

## 📄 Pages & Components

### `Home.js`
The landing page. Contains a hero section with a bold headline, features/benefits section, and call-to-action buttons directing users to browse cars or register.

### `Cars.js`
Displays all available cars in a grid. Reads from `cars` state (passed from `App.js`), which is sourced from `localStorage` (admin edits persist) or the default `carsData.js`. Each car has a "View Details" button.

### `CarDetails.js`
Shows full details for a single car identified by `:id` in the URL. Displays name, image, price per day, and a "Book This Car" button. Redirects to Login if the user is not logged in.

### `Booking.js`
The core booking form:
- Pre-fills user details from `localStorage`
- State → City dropdown with **real coordinates** (Delhi, Haryana, Uttar Pradesh)
- Leaflet.js map renders a live marker at the selected pickup coordinates
- Pickup and return date pickers; calculates total days and price automatically
- Passes all booking data to `Payment.js` via `useNavigate` router state

### `Payment.js`
Handles the full payment flow:
- Shows a detailed booking summary card with car image
- **Razorpay** integration: loads Razorpay SDK, opens checkout modal
- **UPI** option: displays a QR code image and UPI ID (`lakshayyadav1422@okaxis`)
- On successful payment, POSTs the booking to `/api/bookings`

### `Login.js`
Two-step OTP login:
1. Enter email → triggers `POST /send-otp` → OTP emailed
2. Enter OTP → triggers `POST /verify-otp` → fetches user from MongoDB → stores in `localStorage`

### `Register.js`
Registration form collecting name, email, phone, and password. Submits to `POST /api/users/register`.

### `ViewBookings.js`
Fetches and displays all bookings for the currently logged-in user via `GET /api/bookings/:email`.

### `AdminDashboard.js`
Protected admin area showing all bookings from MongoDB, stats, and sidebar navigation to Add Car and Manage Cars.

### `AddCar.js`
Admin form to add a new car (name, price, image URL). Updates the `cars` state in `App.js`, which persists to `localStorage`.

### `ManageCars.js`
Admin table listing all cars with Edit and Delete options. Changes persist to `localStorage`.

---

## 🔌 Backend API

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/send-otp` | Generates & emails a 6-digit OTP (expires in 5 min) |
| `POST` | `/verify-otp` | Validates OTP against in-memory store |
| `POST` | `/api/users/register` | Register a new user in MongoDB |
| `GET` | `/api/users/:email` | Get user info by email |
| `POST` | `/api/bookings` | Save a new booking to MongoDB |
| `GET` | `/api/bookings/:email` | Get all bookings for a user |

---

## 🗄️ Database Schema

### `User` Collection
```js
{
  name:      String,
  email:     String (unique),
  phone:     String,
  password:  String,
  createdAt: Date (default: now)
}
```

### `Booking` Collection
```js
{
  carName:         String,
  carImage:        String,
  userEmail:       String,       // links booking to user
  name:            String,
  email:           String,
  address:         String,
  pickupLocation:  String,       // e.g. "Connaught Place"
  pickupState:     String,       // e.g. "Delhi"
  pickupLat:       Number,
  pickupLng:       Number,
  pickup:          String,       // pickup date
  returnDate:      String,
  days:            Number,
  price:           Number,       // original price
  discountedPrice: Number,       // final amount paid
  createdAt:       Date (default: now)
}
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quickride
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
PORT=5000
```

> ⚠️ **Note:** For Gmail, use an **App Password** (not your regular password). Enable 2FA on your Google account, then generate an App Password from Google Account → Security → App Passwords.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)
- Gmail account with App Password

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/quickride.git
cd quickride
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file as described above, then:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
# From the project root (car-rental-project/)
npm install
npm start
# App runs on http://localhost:3000
```

### 4. Open in Browser
```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
Admin:     http://localhost:3000/admin
```

---

## 🚘 Available Cars (Default Catalogue)

| # | Car | Price/Day |
|---|-----|-----------|
| 1 | Hyundai Verna | ₹2,000 |
| 2 | Mahindra Thar Roxx | ₹4,500 |
| 3 | Toyota Fortuner Legender | ₹6,000 |
| 4 | Hyundai Creta | ₹3,000 |
| 5 | Kia Seltos | ₹3,200 |
| 6 | Ford Endeavour | ₹5,500 |

> Admin can add more cars or edit/delete these via the Admin Panel.

---

## 🏙️ Pickup Locations

### Delhi
- Connaught Place
- IGI Airport (T3)
- Dwarka Sector 21
- Lajpat Nagar

### Haryana
- Gurugram Cyber City
- Faridabad Sector 15
- Panipat Bus Stand
- Ambala Cantt

### Uttar Pradesh
- Noida Sector 18
- Agra Taj Mahal Gate
- Lucknow Hazratganj
- Meerut Bypass

---

## 🛡️ Admin Panel

Access the admin panel at `/admin`. The admin panel is accessible to anyone who navigates to it (no password protection — add auth if deploying to production).

### Admin Capabilities:
- View all bookings from all users
- Add new cars to the fleet
- Edit car names, prices, and images
- Delete cars from the fleet

---

## 💳 Payment Integration

### Razorpay
- Key ID: configured in `Payment.js` (`RAZORPAY_KEY_ID`)
- Uses Razorpay's hosted checkout modal
- Amount passed in paise (₹ × 100)
- On `payment.success` → booking is saved to MongoDB

### UPI / QR Code
- Displays a static QR code image
- UPI ID shown for manual transfer
- User clicks "I've Paid" → booking saved to MongoDB

> ⚠️ Currently using a **test/sandbox Razorpay key**. Replace with a live key for production.

---

## 📦 Dependencies

### Frontend (`package.json`)
```json
"react": "^19.2.4",
"react-dom": "^19.2.4",
"react-router-dom": "^7.13.1",
"bootstrap": "^5.3.8",
"emailjs-com": "^3.2.0"
```

### Backend (`backend/package.json`)
```json
"express": "^5.2.1",
"mongoose": "^9.6.1",
"nodemailer": "^8.0.4",
"cors": "^2.8.6",
"dotenv": "^17.3.1"
```

---

## 📄 License

This project is for educational/personal use. Feel free to fork and build on it.

---

<div align="center">
  Made with ❤️ | <b>QuickRide</b> — Drive Your Way
</div>
