import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const banners = [
  {
    label: "Issue No. 01 — Premium Fleet",
    title: "Drive In Style.",
    highlight: "Style.",
    sub: "Unlimited kilometres. Handpicked vehicles. Zero compromise on the open road.",
    car: { img: "https://i.pinimg.com/736x/97/26/1d/97261d1df86c3c679ad1ff018920336b.jpg", model: "Mahindra Scorpio Classic", price: "₹5,000 / day", tag: "SUV King" },
    accent: "#e63946",
  },
  {
    label: "Issue No. 02 — Anytime, Anywhere",
    title: "Your Road, Your Rules.",
    highlight: "Your Rules.",
    sub: "Hundreds of premium options. Instant booking. No hidden fees, ever.",
    car: { img: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Creta/8667/1751535724464/exterior-image-166.jpg", model: "Hyundai Creta", price: "₹2,500 / day", tag: "BestSeller" },
    accent: "#f4a522",
  },
  {
    label: "Issue No. 03 — Best Value",
    title: "Save More, Drive Farther.",
    highlight: "Drive Farther.",
    sub: "Exclusive rates on extended bookings. The longer you stay, the more you save.",
    car: { img: "https://www.toyota.com.kh/content/dam/cambodia/models/suv/fortuner/features/design-and-comfort/Fortuner%20Legender%20feature%201%20bold.png", model: "Toyota Fortuner", price: "₹6,000 / day", tag: "Premium" },
    accent: "#3ecf8e",
  },
];

const POPULAR = [
  { img: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Creta/8667/1751535724464/exterior-image-166.jpg", name: "Hyundai Creta", price: "₹2,000", badge: "Bestseller", tag: "SUV" },
  { img: "https://stimg2.cardekho.com/images/carNewsEditorImages/userimages/20220628_152045/29296/mahindra0.jpg?impolicy=resize&imwidth=420", name: "Mahindra Scorpio‑N", price: "₹4,500", badge: "SUV", tag: "7-Seater" },
  { img: "https://www.toyota.com.kh/content/dam/cambodia/models/suv/fortuner/features/design-and-comfort/Fortuner%20Legender%20feature%201%20bold.png", name: "Toyota Fortuner", price: "₹6,000", badge: "Premium", tag: "Luxury" },
];

const REVIEWS = [
  { img: "https://randomuser.me/api/portraits/men/32.jpg", name: "Rahul Sharma", stars: 5, text: "Spotless car, effortless booking. The whole experience felt premium from start to finish." },
  { img: "https://randomuser.me/api/portraits/women/44.jpg", name: "Priya Verma", stars: 5, text: "Rented a Fortuner for a hill trip. The car was immaculate and the service outstanding." },
  { img: "https://randomuser.me/api/portraits/men/65.jpg", name: "Amit Singh", stars: 4, text: "Affordable pricing with genuinely responsive customer support. Will absolutely use again." },
  { img: "https://randomuser.me/api/portraits/men/41.jpg", name: "Vikram Nair", stars: 5, text: "Booked a Creta for a weekend road trip and it was absolutely perfect. Clean car, smooth process, and great value for money." },
  { img: "https://randomuser.me/api/portraits/women/58.jpg", name: "Shreya Iyer", stars: 5, text: "I was skeptical at first but Quick-Ride completely won me over. The car was delivered on time and in pristine condition." },
  { img: "https://randomuser.me/api/portraits/men/72.jpg", name: "Rohit Mehta", stars: 4, text: "Great cars, fair pricing. I've recommended Quick-Ride to everyone in my travel group." },
  { img: "https://randomuser.me/api/portraits/women/50.jpg", name: "Anjali Singh", stars: 5, text: "Every car I've rented has been immaculately clean. The support team is exceptional." },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600&family=Bebas+Neue&display=swap');

:root {
  --ink: #0c0c0e;
  --paper: #f5f2eb;
  --paper2: #edeae0;
  --red: #e63946;
  --muted: #888880;
  --border: 1px solid rgba(12,12,14,0.12);
  --font-display: 'Playfair Display', serif;
  --font-hero: 'Bebas Neue', sans-serif;
  --font-body: 'Outfit', sans-serif;
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  overflow-x: hidden;
}

/* ── HERO ── */
.hero-wrap {
  position: relative;
  min-height: 100vh;
  background: var(--ink);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hero-bg-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  transition: opacity 0.8s ease, transform 8s ease;
  transform: scale(1.06);
}

.hero-bg-img.loaded { transform: scale(1); }

.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(105deg, rgba(12,12,14,0.88) 0%, rgba(12,12,14,0.55) 55%, rgba(12,12,14,0.15) 100%);
}

.hero-grain {
  position: absolute; inset: 0; opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  pointer-events: none;
}

.hero-inner {
  position: relative; z-index: 2;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 120px 60px 80px;
  gap: 60px;
  align-items: center;
}

.hero-left { display: flex; flex-direction: column; gap: 0; }

.hero-issue {
  font-family: var(--font-body); font-size: 10px; font-weight: 600;
  letter-spacing: 3px; text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  margin-bottom: 24px;
  display: flex; align-items: center; gap: 12px;
  opacity: 0; animation: fadeUp 0.5s 0.1s forwards;
}

.hero-issue::before {
  content: ''; display: inline-block; width: 28px; height: 1px;
  background: var(--accent-color, var(--red));
}

.hero-title {
  font-family: var(--font-hero);
  font-size: clamp(64px, 8vw, 112px);
  line-height: 0.92;
  color: white;
  letter-spacing: 1px;
  margin-bottom: 28px;
  opacity: 0; animation: fadeUp 0.55s 0.2s forwards;
}

.hero-title .accent-word {
  color: var(--accent-color, var(--red));
  display: block;
  font-style: italic;
  font-family: var(--font-display);
  font-size: clamp(56px, 7vw, 98px);
  font-weight: 900;
  letter-spacing: -1px;
}

.hero-sub {
  font-size: 15px; line-height: 1.75;
  color: rgba(255,255,255,0.6);
  max-width: 440px; margin-bottom: 48px;
  font-weight: 300;
  opacity: 0; animation: fadeUp 0.6s 0.3s forwards;
}

.hero-btns {
  display: flex; gap: 14px; align-items: center;
  opacity: 0; animation: fadeUp 0.65s 0.4s forwards;
}

.btn-hero-primary {
  background: var(--accent-color, var(--red)); color: white;
  padding: 15px 32px; text-decoration: none;
  font-family: var(--font-body); font-size: 12px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  transition: all 0.25s; display: inline-flex; align-items: center; gap: 10px;
  clip-path: polygon(0 0, 92% 0, 100% 20%, 100% 100%, 8% 100%, 0 80%);
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.4);
}

.btn-hero-secondary {
  background: transparent; color: rgba(255,255,255,0.7);
  padding: 14px 24px; text-decoration: none; border: 1px solid rgba(255,255,255,0.2);
  font-family: var(--font-body); font-size: 12px; font-weight: 600;
  letter-spacing: 1.5px; text-transform: uppercase;
  transition: all 0.25s;
}

.btn-hero-secondary:hover {
  background: rgba(255,255,255,0.08); color: white;
  border-color: rgba(255,255,255,0.4);
}

/* hero right */
.hero-right {
  display: flex; flex-direction: column; gap: 20px;
  align-items: flex-end;
  opacity: 0; animation: fadeUp 0.7s 0.35s forwards;
}

.hero-car-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  max-width: 520px;
}

.hero-car-img {
  width: 100%; height: 280px; object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.hero-car-card:hover .hero-car-img { transform: scale(1.04); }

.hero-car-meta {
  padding: 18px 22px;
  display: flex; align-items: center; justify-content: space-between;
}

.hero-car-name { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: white; }
.hero-car-tag { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-top: 2px; }
.hero-car-price { font-family: var(--font-hero); font-size: 22px; color: var(--accent-color, var(--red)); letter-spacing: 1px; }

/* dots */
.hero-footer {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 60px 30px;
  border-top: 1px solid rgba(255,255,255,0.07);
  max-width: 1400px; margin: 0 auto; width: 100%;
}

.hero-dots-row { display: flex; gap: 8px; align-items: center; }

.hero-dot {
  width: 28px; height: 3px;
  background: rgba(255,255,255,0.2);
  cursor: pointer; transition: all 0.3s;
  border-radius: 2px;
}

.hero-dot.active { background: var(--accent-color, var(--red)); width: 48px; }

.hero-stats-row {
  display: flex; gap: 40px; align-items: center;
}

.stat-item { text-align: right; }
.stat-num { font-family: var(--font-hero); font-size: 22px; color: white; letter-spacing: 1px; }
.stat-lbl { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-top: 1px; }

/* progress bar */
.hero-progress {
  position: absolute; bottom: 0; left: 0;
  height: 2px; background: var(--accent-color, var(--red));
  animation: progress 5.5s linear infinite;
  z-index: 3;
}

@keyframes progress { from { width: 0 } to { width: 100% } }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── MARQUEE ── */
.marquee-strip {
  background: var(--ink);
  padding: 14px 0;
  overflow: hidden;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.marquee-inner {
  display: flex; gap: 0; white-space: nowrap;
  animation: marquee 28s linear infinite;
}

.marquee-inner span {
  font-family: var(--font-hero); font-size: 14px; letter-spacing: 3px;
  color: rgba(255,255,255,0.18); padding: 0 32px; text-transform: uppercase;
}

.marquee-inner span.accent { color: var(--red); }

@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }

/* ── SECTIONS ── */
.home-section {
  max-width: 1300px; margin: 0 auto;
  padding: 100px 48px;
}

.section-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 3.5px; text-transform: uppercase;
  color: var(--red); margin-bottom: 12px;
  display: flex; align-items: center; gap: 10px;
}

.section-eyebrow::before {
  content: ''; display: inline-block; width: 20px; height: 1px; background: var(--red);
}

.section-heading {
  font-family: var(--font-display); font-size: clamp(32px, 4vw, 54px);
  font-weight: 900; letter-spacing: -1.5px; line-height: 1.05;
  color: var(--ink); margin-bottom: 56px;
}

/* ── POPULAR ── */
.popular-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
}

.pop-card {
  background: var(--paper2);
  border: 1px solid rgba(12,12,14,0.08);
  overflow: hidden; position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.pop-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); z-index: 1; }

.pop-img-wrap { height: 230px; overflow: hidden; background: var(--paper2); }
.pop-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.55s; }
.pop-card:hover .pop-img-wrap img { transform: scale(1.07); }

.pop-body { padding: 22px 24px; display: flex; align-items: flex-end; justify-content: space-between; }

.pop-badge {
  display: inline-block; background: var(--red); color: white;
  font-size: 8px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
  padding: 3px 8px; margin-bottom: 8px;
}

.pop-name { font-family: var(--font-display); font-size: 20px; font-weight: 900; color: var(--ink); line-height: 1.2; }
.pop-tag-pill { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-top: 4px; }

.pop-price-block { text-align: right; }
.pop-price { font-family: var(--font-hero); font-size: 28px; letter-spacing: 0.5px; color: var(--ink); }
.pop-day { font-size: 10px; color: var(--muted); font-weight: 500; }

/* ── FEATURES ── */
.features-section {
  background: var(--ink);
  padding: 100px 0;
}

.features-inner {
  max-width: 1300px; margin: 0 auto; padding: 0 48px;
}

.features-section .section-eyebrow { color: var(--red); }
.features-section .section-heading { color: white; }

.features-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; border: 1px solid rgba(255,255,255,0.07);
}

.feature-item {
  padding: 48px 40px;
  border-right: 1px solid rgba(255,255,255,0.07);
  transition: background 0.25s;
}

.feature-item:last-child { border-right: none; }
.feature-item:hover { background: rgba(255,255,255,0.03); }

.feature-num {
  font-family: var(--font-hero); font-size: 56px; color: rgba(255,255,255,0.05);
  line-height: 1; margin-bottom: 24px; letter-spacing: 2px;
}

.feature-title {
  font-family: var(--font-display); font-size: 22px; font-weight: 900; font-style: italic;
  color: white; margin-bottom: 14px;
}

.feature-text { font-size: 13.5px; line-height: 1.75; color: rgba(255,255,255,0.45); font-weight: 300; }

.feature-line {
  width: 32px; height: 2px; background: var(--red); margin-bottom: 24px;
}

/* ── REVIEWS ── */
.reviews-outer { background: var(--paper); padding: 100px 0; overflow: hidden; }

.reviews-inner { max-width: 1300px; margin: 0 auto; padding: 0 48px; }

.reviews-track {
  display: flex; gap: 20px; overflow-x: auto;
  scroll-snap-type: x mandatory; padding-bottom: 16px;
  scrollbar-width: none;
}
.reviews-track::-webkit-scrollbar { display: none; }

.review-card {
  flex-shrink: 0; width: 320px; scroll-snap-align: start;
  background: var(--paper2);
  border: 1px solid rgba(12,12,14,0.08);
  padding: 28px;
  transition: transform 0.25s, box-shadow 0.25s;
}

.review-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }

.review-top { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }

.review-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; filter: grayscale(20%); }

.review-name { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--ink); }

.review-stars { color: #f4a522; font-size: 11px; letter-spacing: 1px; margin-top: 2px; }

.review-quote {
  font-size: 13px; line-height: 1.75; color: #555550;
  font-style: italic; font-weight: 300;
  position: relative; padding-left: 14px;
}

.review-quote::before {
  content: '"';
  position: absolute; left: 0; top: -4px;
  font-family: var(--font-display); font-size: 40px; line-height: 1;
  color: rgba(12,12,14,0.06); font-style: normal;
}

/* ── FOOTER ── */
.home-footer {
  background: var(--ink);
  padding: 60px 48px 40px;
  border-top: 3px solid var(--red);
}

.footer-inner {
  max-width: 1300px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
}

.footer-brand {
  font-family: var(--font-hero); font-size: 32px; color: white; letter-spacing: 2px;
}

.footer-brand em { color: var(--red); font-style: normal; }

.footer-copy { font-size: 12px; color: rgba(255,255,255,0.3); font-weight: 300; }

@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; padding: 100px 24px 60px; }
  .hero-right { display: none; }
  .popular-grid, .features-grid { grid-template-columns: 1fr; }
  .home-section, .features-inner, .reviews-inner { padding: 60px 24px; }
  .hero-footer { padding: 20px 24px 24px; }
  .hero-stats-row { display: none; }
}
`;

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [key, setKey] = useState(0);
  const b = banners[current];

  useEffect(() => {
    const t = setInterval(() => slide((current + 1) % banners.length), 5500);
    return () => clearInterval(t);
  }, [current]);

  const slide = (i) => {
    if (i === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(i); setAnimating(false); setKey(k => k + 1); }, 350);
  };

  const titleParts = b.title.split(b.highlight);

  return (
    <>
      <style>{css}</style>

      {/* ── HERO ── */}
      <section className="hero-wrap" style={{ "--accent-color": b.accent }}>
        <div
          className="hero-bg-img loaded"
          style={{
            backgroundImage: `url(${b.car.img})`,
            opacity: animating ? 0 : 0.22,
            transition: "opacity 0.7s",
          }}
        />
        <div className="hero-overlay" />
        <div className="hero-grain" />
        <div className="hero-progress" key={key} />

        <div className="hero-inner">
          {/* LEFT */}
          <div className="hero-left" key={key}>
            <div className="hero-issue">{b.label}</div>

            <h1 className="hero-title" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.4s" }}>
              {titleParts[0]}
              <span className="accent-word">{b.highlight}</span>
            </h1>

            <p className="hero-sub" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.45s 0.05s" }}>
              {b.sub}
            </p>

            <div className="hero-btns">
              <Link to="/cars" className="btn-hero-primary">Browse Fleet →</Link>
              <Link to="/register" className="btn-hero-secondary">Join Free</Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-right" key={`r-${key}`}>
            <div className="hero-car-card">
              <img className="hero-car-img" src={b.car.img} alt={b.car.model} />
              <div className="hero-car-meta">
                <div>
                  <div className="hero-car-name">{b.car.model}</div>
                  <div className="hero-car-tag">{b.car.tag}</div>
                </div>
                <div className="hero-car-price">{b.car.price}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <div className="hero-dots-row">
            {banners.map((_, i) => (
              <div key={i} className={`hero-dot${i === current ? " active" : ""}`} onClick={() => slide(i)} />
            ))}
          </div>
          <div className="hero-stats-row">
            {[{ num: "200+", lbl: "Vehicles" }, { num: "50K+", lbl: "Customers" }, { num: "4.9★", lbl: "Rating" }, { num: "24/7", lbl: "Support" }].map(s => (
              <div className="stat-item" key={s.lbl}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          {Array(4).fill(null).map((_, i) => (
            <React.Fragment key={i}>
              <span>Premium Fleet</span><span className="accent">✦</span>
              <span>Instant Booking</span><span className="accent">✦</span>
              <span>Zero Hidden Fees</span><span className="accent">✦</span>
              <span>24 / 7 Support</span><span className="accent">✦</span>
              <span>Unlimited KMs</span><span className="accent">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── POPULAR ── */}
      <div className="home-section">
        <div className="section-eyebrow">Top Picks</div>
        <h2 className="section-heading">Popular<br /><em>Cars</em></h2>

        <div className="popular-grid">
          {POPULAR.map((car) => (
            <div className="pop-card" key={car.name}>
              <div className="pop-img-wrap"><img src={car.img} alt={car.name} /></div>
              <div className="pop-body">
                <div>
                  <div className="pop-badge">{car.badge}</div>
                  <div className="pop-name">{car.name}</div>
                  <div className="pop-tag-pill">{car.tag}</div>
                </div>
                <div className="pop-price-block">
                  <div className="pop-price">{car.price}</div>
                  <div className="pop-day">per day</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="features-inner">
          <div className="section-eyebrow">Our Edge</div>
          <h2 className="section-heading">Why Quick‑Ride?</h2>

          <div className="features-grid">
            {[
              { n: "01", title: "Unbeatable Prices", text: "Fully transparent pricing. No surprise fees. Best rates for every budget, guaranteed." },
              { n: "02", title: "Instant Booking", text: "Reserve your car in under 60 seconds. Simple, fast, and completely hassle-free." },
              { n: "03", title: "Massive Fleet", text: "200+ vehicles from economy hatchbacks to luxury SUVs — always ready for you." },
            ].map(f => (
              <div className="feature-item" key={f.n}>
                <div className="feature-num">{f.n}</div>
                <div className="feature-line" />
                <div className="feature-title">{f.title}</div>
                <p className="feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <div className="reviews-outer">
        <div className="reviews-inner">
          <div className="section-eyebrow">Testimonials</div>
          <h2 className="section-heading">What Customers Say</h2>

          <div className="reviews-track">
            {REVIEWS.map(r => (
              <div className="review-card" key={r.name}>
                <div className="review-top">
                  <img className="review-avatar" src={r.img} alt={r.name} />
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-stars">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
                  </div>
                </div>
                <p className="review-quote">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand">QUICK<em>RIDE</em></div>
          <div className="footer-copy">
            © 2026 Quick‑Ride Rentals. All rights reserved.<br />Built for Indian roads.
          </div>
        </div>
      </footer>
    </>
  );
}