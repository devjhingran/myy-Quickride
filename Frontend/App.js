import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";

import carsData from "./data/carsData";

import Home        from "./pages/Home";
import Cars        from "./pages/Cars";
import CarDetails  from "./pages/CarDetails";
import Booking     from "./pages/Booking";
import Login       from "./pages/Login";
import Register    from "./pages/Register";
import Payment     from "./pages/Payment";
import ViewBookings from "./pages/ViewBookings";

import AdminDashboard from "./admin/AdminDashboard";
import AddCar         from "./admin/AddCar";
import ManageCars     from "./admin/ManageCars";

/* ── NAVBAR ── */
function Navbar({ user, logout }) {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setShowMenu(false), [location]);

  const active = (p) => location.pathname === p;

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="logo">Quick<span>Ride</span></div>
      </Link>

      <div className="links">
        <Link to="/"    className={active("/")    ? "active" : ""}>Home</Link>
        <Link to="/cars" className={active("/cars") ? "active" : ""}>Cars</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-cta">Get Started</Link>
          </>
        ) : (
          <div className="user-menu">
            <div className="user-name" onClick={() => setShowMenu(!showMenu)}>
              <span style={{
                width: 22, height: 22, background: "var(--red)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, flexShrink: 0,
                fontFamily: "var(--font-condensed)",
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </span>
              {user.name?.split(" ")[0]}
              <span style={{ fontSize: 8, opacity: 0.5 }}>▼</span>
            </div>

            {showMenu && (
              <div className="dropdown">
                <div style={{ padding: "14px 18px", borderBottom: "var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-condensed)", fontSize: 13, fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", color: "var(--black)" }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: "var(--warm-gray)", marginTop: 2 }}>{user.email}</div>
                </div>
                <Link to="/bookings">My Bookings</Link>
                <button onClick={logout} style={{ color: "var(--red)" }}>Logout</button>
              </div>
            )}
          </div>
        )}

        <Link to="/admin" style={{ fontSize: 11, letterSpacing: "1.5px", color: "rgba(245,240,232,0.3)", textTransform: "uppercase" }}>Admin</Link>
      </div>
    </nav>
  );
}

/* ── APP ── */
export default function App() {
  const [cars, setCars] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("currentUser");
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    const s = localStorage.getItem("cars");
    if (s) {
      const p = JSON.parse(s);
      setCars(p.length > 0 ? p : carsData);
    } else {
      setCars(carsData);
    }
  }, []);

  useEffect(() => {
    if (cars.length > 0) localStorage.setItem("cars", JSON.stringify(cars));
  }, [cars]);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <Navbar user={user} logout={logout} />

      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/cars"        element={<Cars cars={cars} />} />
        <Route path="/cardetails/:id" element={<CarDetails cars={cars} />} />
        <Route path="/booking"     element={<Booking />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/payment"     element={<Payment />} />
        <Route path="/bookings"    element={<ViewBookings />} />
        <Route path="/admin"       element={<AdminDashboard />} />
        <Route path="/addcar"      element={<AddCar cars={cars} setCars={setCars} />} />
        <Route path="/managecars"  element={<ManageCars cars={cars} setCars={setCars} />} />
      </Routes>
    </BrowserRouter>
  );
}