import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
body { background: var(--paper); color: var(--ink); font-family: var(--font-body); }

/* ── HEADER ── */
.cars-header {
  background: var(--ink);
  border-bottom: 3px solid var(--red);
  padding: 88px 60px 0;
  position: relative; overflow: hidden;
}

.cars-header-watermark {
  position: absolute; right: 40px; top: 50%; transform: translateY(-50%);
  font-family: var(--font-hero); font-size: 160px; letter-spacing: 6px;
  color: rgba(255,255,255,0.025); pointer-events: none; white-space: nowrap; line-height: 1;
}

.cars-header-inner {
  max-width: 1300px; margin: 0 auto;
}

.cars-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 3.5px; text-transform: uppercase;
  color: var(--red); margin-bottom: 14px;
  display: flex; align-items: center; gap: 10px;
}
.cars-eyebrow::before { content:''; width:20px; height:1px; background:var(--red); display:inline-block; }

.cars-title-row {
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 0;
}

.cars-title {
  font-family: var(--font-hero); font-size: clamp(40px, 5.5vw, 76px);
  color: white; letter-spacing: 2px; line-height: 1;
}

.cars-count-big {
  font-family: var(--font-hero); font-size: 90px; line-height: 1; letter-spacing: -4px;
  color: rgba(255,255,255,0.06); user-select: none; padding-bottom: 0;
}

/* TOOLBAR */
.cars-toolbar {
  max-width: 1300px; margin: 0 auto;
  display: flex; gap: 12px; align-items: center;
  padding: 24px 0 28px;
  border-top: 1px solid rgba(255,255,255,0.07);
  margin-top: 24px;
}

.cars-search-wrap { position: relative; flex: 1; }

.cars-search-icon {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  font-size: 13px; color: rgba(255,255,255,0.25); pointer-events: none;
}

.cars-search {
  width: 100%; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 13px 18px 13px 42px;
  color: white; font-family: var(--font-body); font-size: 13px;
  outline: none; transition: all 0.22s;
}
.cars-search::placeholder { color: rgba(255,255,255,0.25); }
.cars-search:focus { background: rgba(255,255,255,0.09); border-color: var(--red); }

.cars-sort {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 13px 18px;
  color: rgba(255,255,255,0.7); font-family: var(--font-body); font-size: 12px;
  font-weight: 600; letter-spacing: 0.5px;
  outline: none; cursor: pointer; min-width: 200px;
  transition: all 0.22s; appearance: none;
}
.cars-sort:focus { border-color: var(--red); }
.cars-sort option { background: var(--ink); }

/* ── CONTENT ── */
.cars-content {
  max-width: 1300px; margin: 0 auto;
  padding: 48px 60px 80px;
}

/* EMPTY */
.cars-empty {
  text-align: center; padding: 80px 40px;
  background: var(--paper2); border: 1px solid rgba(12,12,14,0.08);
}
.cars-empty-title { font-family: var(--font-display); font-size: 24px; font-weight: 900; font-style: italic; margin-bottom: 10px; }
.cars-empty-sub { font-size: 14px; color: var(--muted); font-weight: 300; }

/* GRID */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.car-card {
  background: var(--paper2);
  border: 1px solid rgba(12,12,14,0.07);
  overflow: hidden; position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  opacity: 0;
  animation: cardIn 0.45s ease forwards;
}

@keyframes cardIn {
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
}

.car-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(12,12,14,0.12); z-index: 1; }

.car-img-wrap {
  height: 220px; overflow: hidden; position: relative;
  background: var(--paper2);
}

.car-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.55s; display: block; }
.car-card:hover .car-img-wrap img { transform: scale(1.07); }

.car-available-tag {
  position: absolute; top: 14px; left: 14px;
  background: var(--ink); color: white;
  font-size: 8px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
  padding: 4px 10px;
}

.car-issue-num {
  position: absolute; bottom: 10px; right: 14px;
  font-family: var(--font-hero); font-size: 40px; line-height: 1;
  color: rgba(255,255,255,0.13); letter-spacing: 1px; user-select: none;
}

.car-body { padding: 22px 24px 20px; }

.car-name {
  font-family: var(--font-display); font-size: 20px; font-weight: 900;
  color: var(--ink); margin-bottom: 4px; line-height: 1.2;
}

.car-specs {
  display: flex; gap: 12px; margin-bottom: 18px;
}

.car-spec {
  font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
  color: var(--muted); display: flex; align-items: center; gap: 4px;
}

.car-spec::before { content: '—'; opacity: 0.3; }
.car-spec:first-child::before { content: none; }

.car-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 16px; border-top: 1px solid rgba(12,12,14,0.08);
}

.car-price { font-family: var(--font-hero); font-size: 26px; letter-spacing: 0.5px; color: var(--ink); line-height: 1; }
.car-price span { font-family: var(--font-body); font-size: 10px; color: var(--muted); font-weight: 400; }

.btn-book-card {
  background: var(--ink); color: white; padding: 10px 18px;
  text-decoration: none; font-family: var(--font-hero); font-size: 13px;
  letter-spacing: 2px; transition: all 0.22s;
  clip-path: polygon(0 0, 88% 0, 100% 20%, 100% 100%, 12% 100%, 0 80%);
}
.btn-book-card:hover { background: var(--red); transform: scale(1.03); }

/* Loading state */
.cars-loading {
  text-align: center; padding: 80px 40px;
  font-family: var(--font-hero); font-size: 22px; letter-spacing: 3px;
  color: var(--muted);
}

@media (max-width: 1024px) { .cars-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .cars-grid { grid-template-columns: 1fr; }
  .cars-content { padding: 36px 24px 60px; }
  .cars-header { padding: 80px 24px 0; }
}
`;

export default function Cars({ cars: propCars }) {
  const [search, setSearch] = useState("");
  const [sort, setSort]     = useState("default");

  // ── NEW: fetch cars from MongoDB; fall back to prop if backend is unreachable ──
  const [cars, setCars] = useState(propCars || []);
  const [loadingCars, setLoadingCars] = useState(false);

  useEffect(() => {
    setLoadingCars(true);
    fetch("http://localhost:5000/api/cars")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCars(data);
        }
        // if MongoDB has no cars yet, propCars (carsData.js) stays as fallback
      })
      .catch(() => {
        // Backend unreachable — silently keep using propCars
      })
      .finally(() => setLoadingCars(false));
  }, []);
  // ── end of new section ──

  const filtered = [...cars]
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "asc")  return a.price - b.price;
      if (sort === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <style>{css}</style>

      {/* HEADER */}
      <div className="cars-header">
        <div className="cars-header-watermark">FLEET</div>
        <div className="cars-header-inner">
          <div className="cars-eyebrow">Our Fleet</div>
          <div className="cars-title-row">
            <h1 className="cars-title">All Cars</h1>
            <div className="cars-count-big">{filtered.length.toString().padStart(2, "0")}</div>
          </div>

          {/* TOOLBAR */}
          <div className="cars-toolbar">
            <div className="cars-search-wrap">
              <span className="cars-search-icon">⌕</span>
              <input
                className="cars-search"
                type="text" placeholder="Search by car name..."
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="cars-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Sort by Default</option>
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="cars-content">
        {loadingCars ? (
          <div className="cars-loading">Loading Fleet...</div>
        ) : filtered.length === 0 ? (
          <div className="cars-empty">
            <div className="cars-empty-title">No results for "{search}"</div>
            <p className="cars-empty-sub">Try a different name or clear your search to see all available cars.</p>
          </div>
        ) : (
          <div className="cars-grid">
            {filtered.map((car, i) => (
              <div className="car-card" key={car.id || car._id} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="car-img-wrap">
                  <img src={car.image} alt={car.name} />
                  <div className="car-available-tag">Available</div>
                  <div className="car-issue-num">{String(i + 1).padStart(2, "0")}</div>
                </div>

                <div className="car-body">
                  <div className="car-name">{car.name}</div>
                  <div className="car-specs">
                    <span className="car-spec">Unlimited KMs</span>
                    <span className="car-spec">Insurance</span>
                    <span className="car-spec">24/7 Support</span>
                  </div>
                  <div className="car-footer">
                    <div>
                      <div className="car-price">
                        ₹{car.price?.toLocaleString()}<span> / day</span>
                      </div>
                    </div>
                    <Link to="/booking" state={{ car }} className="btn-book-card">
                      Book →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}