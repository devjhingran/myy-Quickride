import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

/* ── LOCATION DATA ── */
const LOCATIONS = {
  Delhi: {
    places: [
      { name: "Connaught Place", lat: 28.6315, lng: 77.2167 },
      { name: "IGI Airport (T3)", lat: 28.5562, lng: 77.1000 },
      { name: "Dwarka Sector 21", lat: 28.5523, lng: 77.0588 },
      { name: "Lajpat Nagar", lat: 28.5700, lng: 77.2433 },
    ],
  },
  Haryana: {
    places: [
      { name: "Gurugram Cyber City", lat: 28.4595, lng: 77.0266 },
      { name: "Faridabad Sector 15", lat: 28.3670, lng: 77.3060 },
      { name: "Panipat Bus Stand", lat: 29.3909, lng: 76.9635 },
      { name: "Ambala Cantt", lat: 30.3782, lng: 76.8152 },
    ],
  },
  "Uttar Pradesh": {
    places: [
      { name: "Noida Sector 18", lat: 28.5700, lng: 77.3211 },
      { name: "Agra Taj Mahal Gate", lat: 27.1751, lng: 78.0421 },
      { name: "Lucknow Hazratganj", lat: 26.8467, lng: 80.9462 },
      { name: "Meerut Bypass", lat: 28.9845, lng: 77.7064 },
    ],
  },
};

/* ── LEAFLET LOADER ── */
function useLeaflet() {
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
}

/* ── MINI MAP ── */
function MiniMap({ place }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!place) return;
    const init = () => {
      if (!window.L || !mapRef.current) return;
      const L = window.L;
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
        }).setView([place.lat, place.lng], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstanceRef.current);
      } else {
        mapInstanceRef.current.setView([place.lat, place.lng], 14);
      }
      if (markerRef.current) markerRef.current.remove();
      const icon = L.divIcon({
        html: `<div style="width:18px;height:18px;background:#e63946;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 10px rgba(230,57,70,0.6);"></div>`,
        iconSize: [18, 18], iconAnchor: [9, 18], className: "",
      });
      markerRef.current = L.marker([place.lat, place.lng], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<span style="font-family:sans-serif;font-size:12px;font-weight:600">${place.name}</span>`)
        .openPopup();
    };
    if (window.L) { init(); }
    else {
      const retry = setInterval(() => { if (window.L) { init(); clearInterval(retry); } }, 200);
      return () => clearInterval(retry);
    }
  }, [place]);

  useEffect(() => () => {
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
  }, []);

  if (!place) return null;
  return (
    <div ref={mapRef} style={{ width: "100%", height: "220px", borderRadius: "10px", overflow: "hidden", zIndex: 0, border: "1.5px solid #e2ddd5" }} />
  );
}

/* ── CSS ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

:root {
  --ink: #0c0c0e; --paper: #f5f2eb; --paper2: #edeae0;
  --red: #e63946; --muted: #888880; --green: #3ecf8e;
  --font-display: 'Playfair Display', serif;
  --font-hero: 'Bebas Neue', sans-serif;
  --font-body: 'Outfit', sans-serif;
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--paper);color:var(--ink);font-family:var(--font-body);}

.bk-header{background:var(--ink);border-bottom:3px solid var(--red);padding:88px 60px 36px;position:relative;overflow:hidden;}
.bk-header::before{content:'BOOKING';position:absolute;right:48px;top:50%;transform:translateY(-50%);font-family:var(--font-hero);font-size:160px;letter-spacing:8px;color:rgba(255,255,255,0.03);pointer-events:none;line-height:1;white-space:nowrap;}
.bk-header-inner{max-width:1300px;margin:0 auto;}
.bk-eyebrow{font-size:9px;font-weight:700;letter-spacing:3.5px;text-transform:uppercase;color:var(--red);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.bk-eyebrow::before{content:'';width:20px;height:1px;background:var(--red);display:inline-block;}
.bk-title{font-family:var(--font-hero);font-size:clamp(48px,6vw,80px);color:white;letter-spacing:2px;line-height:1;}
.bk-title em{font-family:var(--font-display);font-style:italic;color:var(--red);font-size:clamp(42px,5.5vw,72px);}

.bk-layout{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:400px 1fr;gap:0;min-height:calc(100vh - 200px);}
.bk-left{background:var(--paper2);border-right:1px solid rgba(12,12,14,0.1);padding:40px 32px;position:sticky;top:0;height:fit-content;}
.car-showcase-img{width:100%;height:200px;object-fit:cover;border-radius:8px;display:block;border:2px solid rgba(12,12,14,0.08);}
.car-showcase-body{background:var(--ink);padding:22px;margin-bottom:0;border-radius:0 0 8px 8px;}
.car-showcase-name{font-family:var(--font-display);font-size:22px;font-weight:900;color:white;margin-bottom:8px;}
.car-showcase-price{font-family:var(--font-hero);font-size:30px;color:var(--red);letter-spacing:1px;}
.car-showcase-price span{font-family:var(--font-body);font-size:12px;color:rgba(255,255,255,0.4);font-weight:300;}
.car-perks{display:flex;flex-direction:column;gap:9px;margin-top:18px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.07);}
.car-perk{display:flex;align-items:center;gap:10px;font-size:12px;color:rgba(255,255,255,0.55);font-weight:300;}
.perk-dot{width:14px;height:14px;background:var(--red);display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:2px;}
.perk-dot::after{content:'✓';font-size:8px;color:white;font-weight:700;}
.no-car-state{text-align:center;padding:60px 20px;}
.no-car-icon{font-size:48px;margin-bottom:16px;opacity:0.3;}
.no-car-text{font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}

.bk-right{padding:44px 52px;}
.form-section-title{font-family:var(--font-display);font-size:26px;font-weight:900;font-style:italic;color:var(--ink);margin-bottom:4px;}
.form-section-sub{font-size:13px;color:var(--muted);margin-bottom:28px;font-weight:300;}

.form-steps{display:flex;gap:0;margin-bottom:32px;border-radius:8px;overflow:hidden;border:1.5px solid rgba(12,12,14,0.1);}
.step{flex:1;display:flex;align-items:center;gap:9px;padding:12px 16px;background:white;border-right:1px solid rgba(12,12,14,0.08);font-size:11px;font-weight:500;color:var(--muted);transition:all 0.2s;}
.step:last-child{border-right:none;}
.step.active{background:var(--ink);color:white;}
.step.done{background:#1a2a1a;color:var(--green);}
.step-num{width:20px;height:20px;border-radius:50%;background:rgba(12,12,14,0.08);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;}
.step.active .step-num{background:var(--red);color:white;}
.step.done .step-num{background:var(--green);color:white;}

.field{margin-bottom:18px;}
.field label{display:block;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.field input,.field select{width:100%;background:white;border:1.5px solid rgba(12,12,14,0.1);border-bottom:2px solid rgba(12,12,14,0.14);padding:13px 16px;color:var(--ink);font-family:var(--font-body);font-size:14px;outline:none;transition:all 0.22s;border-radius:8px;appearance:none;-webkit-appearance:none;}
.field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:white;cursor:pointer;}
.field input::placeholder{color:rgba(12,12,14,0.3);}
.field input:focus,.field select:focus{border-color:var(--ink);border-bottom-color:var(--red);background:#fffef9;box-shadow:0 0 0 3px rgba(230,57,70,0.06);}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

.location-box{background:white;border:1.5px solid rgba(12,12,14,0.08);border-radius:12px;padding:22px;margin-bottom:22px;border-top:3px solid var(--red);box-shadow:0 4px 20px rgba(12,12,14,0.05);}
.location-box-header{display:flex;align-items:center;gap:12px;margin-bottom:18px;}
.location-box-icon{width:36px;height:36px;background:var(--red);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.location-box-title{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink);}
.location-box-sub{font-size:11px;color:var(--muted);margin-top:2px;}
.loc-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.loc-field label{display:block;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:7px;}
.loc-field select{width:100%;background:var(--paper2);border:1.5px solid rgba(12,12,14,0.1);border-radius:8px;padding:11px 36px 11px 13px;color:var(--ink);font-family:var(--font-body);font-size:13px;outline:none;transition:all 0.22s;appearance:none;-webkit-appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;}
.loc-field select:focus{border-color:var(--red);background-color:#fffef9;}
.loc-field select:disabled{opacity:0.4;cursor:not-allowed;}
.place-badge{display:inline-flex;align-items:center;gap:7px;background:var(--ink);color:white;font-size:11px;font-weight:500;padding:7px 14px;border-radius:20px;margin-bottom:14px;animation:popIn 0.3s ease;}
.place-badge-dot{width:7px;height:7px;background:var(--green);border-radius:50%;flex-shrink:0;}
.map-label{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.map-label::before{content:'';width:12px;height:1px;background:var(--muted);display:inline-block;}
.map-anim{animation:fadeUp 0.4s ease;}

.price-preview{background:var(--ink);padding:18px 22px;border-radius:10px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;animation:fadeUp 0.3s ease;border-left:4px solid var(--red);}
.price-preview-label{font-size:11px;color:rgba(255,255,255,0.5);font-weight:300;}
.price-preview-total{font-family:var(--font-hero);font-size:34px;color:white;letter-spacing:1px;}
.price-preview-sub{font-size:10px;color:var(--red);font-weight:600;letter-spacing:1px;text-transform:uppercase;}

.btn-confirm{width:100%;background:var(--ink);color:white;border:none;padding:17px 32px;font-family:var(--font-hero);font-size:18px;letter-spacing:3px;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:12px;border-radius:8px;}
.btn-confirm:hover{background:var(--red);transform:translateY(-2px);box-shadow:0 10px 30px rgba(230,57,70,0.3);}
.btn-confirm:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

.confirmation-section{border-top:1px solid rgba(12,12,14,0.1);padding:64px 52px;max-width:1300px;margin:0 auto;animation:fadeUp 0.5s ease;}
.confirmed-eyebrow{font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--green);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.confirmed-eyebrow::before{content:'';width:20px;height:1px;background:var(--green);display:inline-block;}
.confirmed-title{font-family:var(--font-display);font-size:clamp(26px,4vw,40px);font-weight:900;color:var(--ink);margin-bottom:36px;line-height:1.1;}
.confirmed-body{display:grid;grid-template-columns:340px 1fr;gap:40px;align-items:start;}
.confirmed-img{width:100%;height:220px;object-fit:cover;border-radius:10px;border:2px solid rgba(12,12,14,0.08);}
.details-table{width:100%;border-collapse:collapse;}
.details-table tr{border-bottom:1px solid rgba(12,12,14,0.07);}
.details-table td{padding:12px 0;font-size:13px;vertical-align:top;}
.details-table td:first-child{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);width:130px;padding-top:15px;}

/* ── DISCOUNT STYLES ── */
.price-block{margin:24px 0;}
.original-price{font-size:15px;color:var(--muted);text-decoration:line-through;margin-bottom:4px;font-weight:400;}
.discount-badge{display:inline-flex;align-items:center;gap:6px;background:#fff3cd;color:#856404;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 12px;border-radius:20px;margin-bottom:10px;border:1px solid #ffc107;}
.discount-badge-icon{font-size:13px;}
.confirmed-total{font-family:var(--font-hero);font-size:50px;color:var(--green);letter-spacing:1px;line-height:1;}
.confirmed-total-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--green);opacity:0.75;margin-bottom:16px;}

.btn-pay{background:var(--red);color:white;border:none;padding:15px 36px;font-family:var(--font-hero);font-size:18px;letter-spacing:3px;cursor:pointer;transition:all 0.25s;border-radius:8px;}
.btn-pay:hover{background:var(--ink);transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.2);}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
@keyframes popIn{from{opacity:0;transform:scale(0.9);}to{opacity:1;transform:scale(1);}}

@media(max-width:960px){
  .bk-layout{grid-template-columns:1fr;}
  .bk-left{position:static;}
  .bk-right{padding:32px 20px;}
  .bk-header{padding:80px 24px 32px;}
  .confirmed-body{grid-template-columns:1fr;}
  .loc-grid{grid-template-columns:1fr;}
  .form-steps{flex-wrap:wrap;}
  .step{flex:1 1 45%;}
}
`;

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state?.car;
  useLeaflet();

  const [form, setForm] = useState({ name: "", email: "", pickup: "", returnDate: "" });
  const [selectedState, setSelectedState] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const update = (f) => (e) => {
    const value = e.target.value;
    if (f === "pickup" && value && value < todayStr) {
      alert("Please select a valid date. Pickup date cannot be in the past.");
      return;
    }
    if (f === "returnDate" && value && form.pickup && value < form.pickup) {
      alert("Please select a valid date. Return date cannot be before pickup date.");
      return;
    }
    setForm({ ...form, [f]: value });
  };

  const handleStateChange = (e) => { setSelectedState(e.target.value); setSelectedPlace(null); };
  const handlePlaceChange = (e) => {
    const place = LOCATIONS[selectedState]?.places.find(p => p.name === e.target.value) || null;
    setSelectedPlace(place);
  };

  const days = form.pickup && form.returnDate
    ? Math.max(0, (new Date(form.returnDate) - new Date(form.pickup)) / 86400000) : 0;

  const step = !form.name ? 1 : !selectedPlace ? 2 : !form.pickup ? 3 : 4;

  // ── ONLY THIS FUNCTION CHANGED: now also saves to MongoDB ──
  const handleBooking = async () => {
    if (!form.name || !form.email || !selectedPlace || !form.pickup || !form.returnDate) {
      alert("Please fill all details and select a pickup location"); return;
    }
    if (!form.email.includes("@")) { alert("Invalid email"); return; }
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) { alert("Please login first"); return; }
    if (days <= 0) { alert("Return date must be after pickup date"); return; }

    setLoading(true);

    const originalPrice = days * car.price;
    const discountedPrice = Math.round(originalPrice * 0.10);

    const data = {
      carName: car.name, carImage: car.image, userEmail: user.email,
      name: form.name, email: form.email,
      address: `${selectedPlace.name}, ${selectedState}`,
      pickupLocation: selectedPlace.name,
      pickupState: selectedState,
      pickupLat: selectedPlace.lat,
      pickupLng: selectedPlace.lng,
      pickup: form.pickup, returnDate: form.returnDate,
      days,
      price: originalPrice,
      discountedPrice,
    };

    // ── Save to localStorage (existing behaviour — kept unchanged) ──
    const all = JSON.parse(localStorage.getItem("bookings")) || [];
    all.push(data);
    localStorage.setItem("bookings", JSON.stringify(all));

    // ── NEW: Also save to MongoDB via backend ──
    try {
      await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("MongoDB save failed (booking still saved locally):", err);
    }

    setBooking(data);
    setForm({ name: "", email: "", pickup: "", returnDate: "" });
    setSelectedState(""); setSelectedPlace(null);
    setLoading(false);
  };

  const statePlaces = selectedState ? LOCATIONS[selectedState]?.places || [] : [];

  return (
    <>
      <style>{css}</style>

      <div className="bk-header">
        <div className="bk-header-inner">
          <div className="bk-eyebrow">Reserve Your Ride</div>
          <h1 className="bk-title">Book Your <em>Car</em></h1>
        </div>
      </div>

      <div className="bk-layout">
        <div className="bk-left">
          {car ? (
            <>
              <img className="car-showcase-img" src={car.image} alt={car.name} />
              <div className="car-showcase-body">
                <div className="car-showcase-name">{car.name}</div>
                <div className="car-showcase-price">₹{car.price?.toLocaleString()}<span> / day</span></div>
                <div className="car-perks">
                  {["Clean & sanitized", "Unlimited kilometres", "Insurance included", "24/7 support"].map(p => (
                    <div className="car-perk" key={p}><div className="perk-dot" />{p}</div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="no-car-state">
              <div className="no-car-icon">🚗</div>
              <div className="no-car-text">No car selected</div>
              <Link to="/cars" style={{ background: "var(--ink)", color: "white", padding: "12px 24px", textDecoration: "none", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "inline-block", borderRadius: 6 }}>
                Browse Fleet →
              </Link>
            </div>
          )}
        </div>

        <div className="bk-right">
          <div className="form-section-title">Complete Your Booking</div>
          <p className="form-section-sub">Fill in your details, choose a pickup location and dates</p>

          <div className="form-steps">
            {[["1","Personal Info"],["2","Location"],["3","Dates"],["4","Confirm"]].map(([n,l],i) => (
              <div key={n} className={`step ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}>
                <div className="step-num">{step > i+1 ? "✓" : n}</div>
                <div>{l}</div>
              </div>
            ))}
          </div>

          <div className="field"><label>Full Name</label><input type="text" placeholder="Rahul Sharma" value={form.name} onChange={update("name")} /></div>
          <div className="field"><label>Email Address</label><input type="email" placeholder="rahul@example.com" value={form.email} onChange={update("email")} /></div>

          <div className="location-box">
            <div className="location-box-header">
              <div className="location-box-icon">📍</div>
              <div>
                <div className="location-box-title">Pickup Location</div>
                <div className="location-box-sub">Select your state and nearest pickup hub</div>
              </div>
            </div>
            <div className="loc-grid">
              <div className="loc-field">
                <label>State</label>
                <select value={selectedState} onChange={handleStateChange}>
                  <option value="">— Choose State —</option>
                  {Object.keys(LOCATIONS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="loc-field">
                <label>Area / Hub</label>
                <select value={selectedPlace?.name || ""} onChange={handlePlaceChange} disabled={!selectedState}>
                  <option value="">— Choose Area —</option>
                  {statePlaces.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>
            {selectedPlace && (
              <>
                <div className="place-badge">
                  <div className="place-badge-dot" />
                  {selectedPlace.name}, {selectedState}
                </div>
                <div className="map-anim">
                  <div className="map-label">Live Pickup Map</div>
                  <MiniMap place={selectedPlace} />
                </div>
              </>
            )}
          </div>

          <div className="field-row">
            <div className="field"><label>Pickup Date</label><input type="date" value={form.pickup} onChange={update("pickup")} min={todayStr} /></div>
            <div className="field"><label>Return Date</label><input type="date" value={form.returnDate} onChange={update("returnDate")} min={form.pickup || todayStr} /></div>
          </div>

          {days > 0 && car && (
            <div className="price-preview">
              <div>
                <div className="price-preview-label">{days} day{days > 1 ? "s" : ""} × ₹{car.price?.toLocaleString()}</div>
                <div className="price-preview-sub">Total Rental Cost</div>
              </div>
              <div className="price-preview-total">₹{(days * car.price).toLocaleString()}</div>
            </div>
          )}

          <button className="btn-confirm" onClick={handleBooking} disabled={loading}>
            {loading ? "⏳ Confirming..." : "Confirm Booking →"}
          </button>
        </div>
      </div>

      {booking && (
        <div className="confirmation-section">
          <div className="confirmed-eyebrow">Booking Confirmed</div>
          <h2 className="confirmed-title">You're all set — {booking.carName}</h2>
          <div className="confirmed-body">
            <img className="confirmed-img" src={booking.carImage} alt={booking.carName} />
            <div>
              <table className="details-table">
                <tbody>
                  {[
                    ["Car", booking.carName],
                    ["Name", booking.name],
                    ["Email", booking.email],
                    ["Pickup", `${booking.pickupLocation}, ${booking.pickupState}`],
                    ["Pickup Date", booking.pickup],
                    ["Return Date", booking.returnDate],
                    ["Duration", `${booking.days} day${booking.days > 1 ? "s" : ""}`],
                  ].map(([k,v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                </tbody>
              </table>

              {/* ── DISCOUNT PRICE BLOCK ── */}
              <div className="price-block">
                <div className="original-price">₹{booking.price?.toLocaleString()} (Original Price)</div>
                <div className="discount-badge">
                  <span className="discount-badge-icon">🏷️</span>
                  90% OFF Applied
                </div>
                <div className="confirmed-total-label">Amount Payable</div>
                <div className="confirmed-total">₹{booking.discountedPrice?.toLocaleString()}</div>
              </div>

              <button className="btn-pay" onClick={() => navigate("/payment", { state: { car, booking } })}>
                Proceed to Payment →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}