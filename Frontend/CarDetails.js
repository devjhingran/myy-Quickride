import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

:root {
  --ink: #0c0c0e;
  --paper: #f5f2eb;
  --paper2: #edeae0;
  --red: #e63946;
  --muted: #888880;
  --font-display: 'Playfair Display', serif;
  --font-hero: 'Bebas Neue', sans-serif;
  --font-body: 'Outfit', sans-serif;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background: var(--paper); color: var(--ink); font-family: var(--font-body); overflow-x: hidden; }

/* ── 404 ── */
.not-found {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: var(--paper); gap: 20px; text-align: center; padding: 40px;
}

.not-found-num {
  font-family: var(--font-hero); font-size: clamp(100px, 20vw, 180px);
  color: rgba(12,12,14,0.05); line-height: 1; letter-spacing: 8px;
}

.not-found h2 { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--ink); }
.not-found p { font-size: 14px; color: var(--muted); font-weight: 300; max-width: 320px; }

.btn-browse {
  background: var(--ink); color: white; padding: 14px 32px;
  text-decoration: none; font-family: var(--font-hero); font-size: 16px;
  letter-spacing: 2.5px; transition: all 0.25s; display: inline-block; margin-top: 8px;
  clip-path: polygon(0 0, 92% 0, 100% 18%, 100% 100%, 8% 100%, 0 82%);
}
.btn-browse:hover { background: var(--red); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(230,57,70,0.25); }

/* ── BREADCRUMB ── */
.breadcrumb {
  background: var(--ink);
  padding: 16px 60px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.breadcrumb a, .breadcrumb span {
  font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
  text-decoration: none; color: rgba(255,255,255,0.35); transition: color 0.2s;
}
.breadcrumb a:hover { color: rgba(255,255,255,0.7); }
.breadcrumb .sep { color: rgba(255,255,255,0.15); font-size: 12px; }
.breadcrumb .current { color: var(--red); }

/* ── HERO BLOCK ── */
.cd-hero {
  background: var(--ink);
  display: grid; grid-template-columns: 1fr 1fr;
  min-height: 70vh;
  position: relative; overflow: hidden;
}

.cd-hero-img-wrap {
  position: relative; overflow: hidden;
}

.cd-hero-img-wrap::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 60%, var(--ink) 100%);
}

.cd-hero-img {
  width: 100%; height: 100%; object-fit: cover;
  display: block; min-height: 500px;
  filter: brightness(0.9) contrast(1.05);
  transition: transform 0.8s ease;
}

.cd-hero-img:hover { transform: scale(1.04); }

.cd-hero-content {
  padding: 72px 60px 60px 48px;
  display: flex; flex-direction: column; justify-content: center;
  position: relative; z-index: 1;
}

.cd-badge {
  display: inline-block; background: var(--red); color: white;
  font-size: 9px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase;
  padding: 5px 12px; margin-bottom: 24px; width: fit-content;
  animation: slideIn 0.4s 0.1s both;
}

.cd-car-name {
  font-family: var(--font-hero);
  font-size: clamp(48px, 5.5vw, 80px);
  color: white; letter-spacing: 2px; line-height: 0.9;
  margin-bottom: 24px;
  animation: slideIn 0.45s 0.2s both;
}

.cd-car-name em {
  font-family: var(--font-display); font-style: italic;
  color: var(--red); display: block;
  font-size: clamp(40px, 4.5vw, 68px); letter-spacing: 0;
}

.cd-desc {
  font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.5);
  font-weight: 300; max-width: 420px; margin-bottom: 40px;
  animation: slideIn 0.5s 0.3s both;
}

@keyframes slideIn { from { opacity:0; transform: translateX(-20px); } to { opacity:1; transform: translateX(0); } }

/* ── SPEC STRIP ── */
.spec-strip {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid rgba(255,255,255,0.07);
  animation: fadeUp 0.5s 0.35s both;
}

.spec-item {
  padding: 20px 0; border-right: 1px solid rgba(255,255,255,0.07);
  transition: background 0.2s;
}
.spec-item:last-child { border-right: none; }
.spec-item:hover { background: rgba(255,255,255,0.03); }

.spec-label {
  font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  color: rgba(255,255,255,0.3); margin-bottom: 6px;
}

.spec-value {
  font-family: var(--font-hero); font-size: 20px; letter-spacing: 1px;
  color: white; line-height: 1;
}

.spec-value.red { color: var(--red); }

/* ── PRICE ROW ── */
.price-action-row {
  display: flex; align-items: center; gap: 24px; margin-top: 40px;
  animation: fadeUp 0.5s 0.4s both;
}

.big-price {
  display: flex; flex-direction: column;
}

.big-price-num {
  font-family: var(--font-hero); font-size: 56px; letter-spacing: 1px; line-height: 1;
  color: white;
}

.big-price-day { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 300; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }

.btn-book {
  background: var(--red); color: white; border: none; padding: 18px 40px;
  text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-hero); font-size: 18px; letter-spacing: 3px;
  cursor: pointer; transition: all 0.25s; flex-shrink: 0;
  clip-path: polygon(0 0, 92% 0, 100% 18%, 100% 100%, 8% 100%, 0 82%);
}

.btn-book:hover { background: white; color: var(--ink); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,0.4); }

@keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }

/* ── DETAILS SECTION ── */
.cd-details {
  max-width: 1300px; margin: 0 auto; padding: 80px 60px;
  display: grid; grid-template-columns: 1fr 380px; gap: 64px;
}

.cd-about-title {
  font-family: var(--font-display); font-size: 32px; font-weight: 900; font-style: italic;
  color: var(--ink); margin-bottom: 20px;
}

.cd-about-text {
  font-size: 15px; line-height: 1.85; color: #555550; font-weight: 300;
  margin-bottom: 32px;
}

.cd-features-title {
  font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
  color: var(--red); margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.cd-features-title::before { content:''; width:16px; height:1px; background:var(--red); display:inline-block; }

.cd-feature-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }

.cd-feature-list li {
  font-size: 13.5px; color: #555550; font-weight: 400;
  display: flex; align-items: center; gap: 10px; padding-bottom: 10px;
  border-bottom: 1px solid rgba(12,12,14,0.06);
}

.cd-feature-list li::before {
  content: ''; width: 12px; height: 12px; background: var(--red);
  flex-shrink: 0; clip-path: polygon(0 50%, 35% 100%, 100% 0, 35% 55%);
}

/* SIDEBAR CARD */
.cd-sidebar-card {
  background: var(--paper2); border: 1px solid rgba(12,12,14,0.1);
  padding: 32px; align-self: start; position: sticky; top: 24px;
}

.sidebar-price-label {
  font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
  color: var(--muted); margin-bottom: 8px;
}

.sidebar-price-num {
  font-family: var(--font-hero); font-size: 48px; color: var(--ink);
  letter-spacing: 1px; line-height: 1; margin-bottom: 4px;
}

.sidebar-price-per { font-size: 12px; color: var(--muted); font-weight: 300; margin-bottom: 28px; }

.sidebar-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0; border-bottom: 1px solid rgba(12,12,14,0.08);
  font-size: 12.5px;
}

.sidebar-row:last-of-type { border-bottom: none; margin-bottom: 24px; }
.sidebar-row-label { color: var(--muted); font-weight: 400; font-size: 11px; letter-spacing: 0.5px; }
.sidebar-row-val { font-weight: 600; color: var(--ink); }

.btn-book-sidebar {
  width: 100%; background: var(--ink); color: white; border: none;
  padding: 16px; text-decoration: none; display: block; text-align: center;
  font-family: var(--font-hero); font-size: 16px; letter-spacing: 3px;
  cursor: pointer; transition: all 0.25s;
  clip-path: polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%);
}
.btn-book-sidebar:hover { background: var(--red); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(230,57,70,0.3); }

@media (max-width: 900px) {
  .cd-hero { grid-template-columns: 1fr; }
  .cd-hero-img-wrap { height: 300px; }
  .cd-hero-img-wrap::after { background: linear-gradient(0deg, var(--ink) 0%, transparent 60%); }
  .cd-hero-content { padding: 32px 24px 48px; }
  .breadcrumb { padding: 14px 24px; }
  .spec-strip { grid-template-columns: repeat(2, 1fr); }
  .cd-details { grid-template-columns: 1fr; padding: 48px 24px; }
  .cd-sidebar-card { position: static; }
  .price-action-row { flex-direction: column; align-items: flex-start; gap: 16px; }
}
`;

export default function CarDetails({ cars }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find((c) => c.id === parseInt(id));

  if (!car) return (
    <>
      <style>{css}</style>
      <div className="not-found">
        <div className="not-found-num">404</div>
        <h2>Car Not Found</h2>
        <p>The vehicle you're looking for has either been removed or doesn't exist.</p>
        <Link to="/cars" className="btn-browse">Browse All Cars →</Link>
      </div>
    </>
  );

  const nameParts = car.name.split(" ");
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(" ");

  const specs = [
    { label: "Daily Rate", value: `₹${car.price?.toLocaleString()}`, red: true },
    { label: "Mileage", value: "Unlimited" },
    { label: "Pickup", value: "Instant" },
    { label: "Insurance", value: "Included" },
  ];

  return (
    <>
      <style>{css}</style>

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/cars">Cars</Link>
        <span className="sep">/</span>
        <span className="current">{car.name}</span>
      </div>

      {/* HERO */}
      <div className="cd-hero">
        <div className="cd-hero-img-wrap">
          <img className="cd-hero-img" src={car.image} alt={car.name} />
        </div>

        <div className="cd-hero-content">
          <div className="cd-badge">Available Now</div>

          <h1 className="cd-car-name">
            {firstName}
            {restName && <em>{restName}</em>}
          </h1>

          <p className="cd-desc">
            The {car.name} is a thoroughly modern vehicle built for Indian roads.
            Whether it's a city commute or a cross-state adventure, it delivers comfort,
            power, and reliability in every kilometre.
          </p>

          <div className="spec-strip">
            {specs.map(s => (
              <div className="spec-item" key={s.label}>
                <div className="spec-label">{s.label}</div>
                <div className={`spec-value${s.red ? " red" : ""}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="price-action-row">
            <div className="big-price">
              <div className="big-price-num">₹{car.price?.toLocaleString()}</div>
              <div className="big-price-day">per day</div>
            </div>
            <Link to="/booking" state={{ car }} className="btn-book">
              Book This Car →
            </Link>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="cd-details">
        <div>
          <h2 className="cd-about-title">About This Vehicle</h2>
          <p className="cd-about-text">
            The {car.name} combines modern design with powerful performance, making it
            the perfect choice for both urban commutes and long highway drives. Every vehicle
            in our fleet is meticulously serviced before each rental to ensure your safety
            and absolute comfort throughout your journey.
          </p>
          <p className="cd-about-text">
            From its responsive handling to its refined interior, the {car.name} sets
            the benchmark for rental vehicles in India. Enjoy clean interiors, a full tank,
            and 24/7 roadside assistance — all included in your booking price.
          </p>

          <div className="cd-features-title">What's Included</div>
          <ul className="cd-feature-list">
            {["Deep cleaned & sanitized before each trip", "Unlimited kilometres — no hidden charges", "Comprehensive insurance coverage", "24/7 roadside assistance & customer support", "Full fuel tank at pickup", "Flexible pickup locations across the city"].map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        {/* SIDEBAR */}
        <div className="cd-sidebar-card">
          <div className="sidebar-price-label">Rental Rate</div>
          <div className="sidebar-price-num">₹{car.price?.toLocaleString()}</div>
          <div className="sidebar-price-per">per day · all inclusive</div>

          {[
            ["Mileage", "Unlimited KMs"],
            ["Pickup", "Instant Confirmation"],
            ["Insurance", "Fully Covered"],
            ["Support", "24 / 7"],
            ["Cancellation", "Free · 24h before"],
          ].map(([k, v]) => (
            <div className="sidebar-row" key={k}>
              <span className="sidebar-row-label">{k}</span>
              <span className="sidebar-row-val">{v}</span>
            </div>
          ))}

          <Link to="/booking" state={{ car }} className="btn-book-sidebar">
            Book This Car →
          </Link>
        </div>
      </div>
    </>
  );
}