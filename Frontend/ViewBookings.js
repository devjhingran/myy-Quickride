import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

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

/* ── BOOKING MAP ── */
function BookingMap({ lat, lng, label }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng) return;
    const init = () => {
      if (!window.L || !mapRef.current) return;
      const L = window.L;
      if (instanceRef.current) return;
      instanceRef.current = L.map(mapRef.current, {
        zoomControl: false, scrollWheelZoom: false, dragging: false,
        attributionControl: false,
      }).setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(instanceRef.current);
      const icon = L.divIcon({
        html: `<div style="width:16px;height:16px;background:#a78bfa;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(167,139,250,0.3),0 4px 12px rgba(167,139,250,0.6);"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8], className: "",
      });
      L.marker([lat, lng], { icon })
        .addTo(instanceRef.current)
        .bindPopup(`<span style="font-family:sans-serif;font-size:11px;font-weight:600">${label}</span>`)
        .openPopup();
    };
    if (window.L) { init(); }
    else {
      const retry = setInterval(() => { if (window.L) { init(); clearInterval(retry); } }, 200);
      return () => clearInterval(retry);
    }
  }, [lat, lng, label]);

  useEffect(() => () => {
    if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
  }, []);

  if (!lat || !lng) return null;
  return <div ref={mapRef} style={{ width: "100%", height: "100%", zIndex: 0 }} />;
}

/* ── STATUS HELPER ── */
function getStatus(booking) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const pickup = new Date(booking.pickup);
  const ret = new Date(booking.returnDate);
  if (today >= pickup && today <= ret) return "active";
  if (today < pickup) return "upcoming";
  return "completed";
}

/* ── FILTER PILL ── */
function FilterPill({ label, count, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 18px",
        borderRadius: 999,
        border: active ? `1.5px solid ${color}` : "1.5px solid rgba(255,255,255,0.1)",
        background: active ? `${color}18` : "rgba(255,255,255,0.04)",
        color: active ? color : "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.2s",
      }}
    >
      {label}
      <span style={{
        background: active ? color : "rgba(255,255,255,0.1)",
        color: active ? "#fff" : "rgba(255,255,255,0.4)",
        borderRadius: 999,
        padding: "1px 7px",
        fontSize: 10,
        fontWeight: 700,
      }}>{count}</span>
    </button>
  );
}

/* ── BOOKING CARD ── */
function BookingCard({ b, index, onCancel }) {
  const status = getStatus(b);
  const hasMap = !!(b.pickupLat && b.pickupLng);
  const [hover, setHover] = useState(false);

  const statusConfig = {
    active: { color: "#34d399", bg: "rgba(52,211,153,0.12)", label: "Active Now", dot: "#34d399" },
    upcoming: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", label: "Upcoming", dot: "#fbbf24" },
    completed: { color: "#9ca3af", bg: "rgba(156,163,175,0.10)", label: "Completed", dot: "#9ca3af" },
  };
  const sc = statusConfig[status];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.04) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: hover ? "1px solid rgba(167,139,250,0.25)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 20,
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hover
          ? "0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.1)"
          : "0 4px 24px rgba(0,0,0,0.2)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        animation: `slideIn 0.5s ease both`,
        animationDelay: `${index * 0.07}s`,
      }}
    >
      {/* TOP ACCENT BAR */}
      <div style={{
        height: 3,
        background: status === "active"
          ? "linear-gradient(90deg, #34d399, #10b981)"
          : status === "upcoming"
            ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
            : "linear-gradient(90deg, #6b7280, #4b5563)",
      }} />

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 280px" }}>

        {/* CAR IMAGE */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: 220 }}>
          {b.carImage
            ? <img src={b.carImage} alt={b.carName} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease", display: "block" }} />
            : <div style={{ width: "100%", height: "100%", minHeight: 220, background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(139,92,246,0.08))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🚗</div>
          }
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1.2 }}>{b.carName}</div>
          </div>
          {/* Booking number badge */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            borderRadius: 8, padding: "4px 10px",
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
            color: "rgba(255,255,255,0.7)", letterSpacing: 1,
          }}>
            #{String(index + 1).padStart(3, "0")}
          </div>
        </div>

        {/* BOOKING DETAILS */}
        <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {/* Status + name row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{b.name}</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 13px", borderRadius: 999,
                background: sc.bg, color: sc.color,
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block", boxShadow: `0 0 6px ${sc.dot}` }} />
                {sc.label}
              </span>
            </div>

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
              {[
                { label: "Pickup Date", val: b.pickup },
                { label: "Return Date", val: b.returnDate },
                { label: "Duration", val: `${b.days} day${b.days !== 1 ? "s" : ""}` },
                { label: "Location", val: `${b.pickupLocation || b.address || "—"}${b.pickupState ? `, ${b.pickupState}` : ""}` },
                { label: "Email", val: b.email },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 16 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "white", lineHeight: 1 }}>
                ₹{Number(b.price).toLocaleString()}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>Total paid</div>
            </div>
            {status !== "completed" && (
              <button
                onClick={() => onCancel(b)}
                style={{
                  padding: "9px 20px",
                  background: "transparent",
                  color: "#f87171",
                  border: "1.5px solid rgba(248,113,113,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                  textTransform: "uppercase", cursor: "pointer",
                  borderRadius: 10, transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(248,113,113,0.15)";
                  e.currentTarget.style.borderColor = "#f87171";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)";
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* MAP PANEL */}
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📍</div>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Pickup Point</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>{b.pickupLocation || b.address || "Not specified"}</div>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 155, position: "relative", overflow: "hidden" }}>
            {hasMap
              ? <BookingMap lat={b.pickupLat} lng={b.pickupLng} label={b.pickupLocation || b.address} />
              : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 20 }}>
                  <div style={{ fontSize: 28, opacity: 0.15 }}>🗺️</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", textAlign: "center", letterSpacing: 0.5 }}>Map unavailable<br />for this booking</div>
                </div>
              )
            }
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  useLeaflet();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const all = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(all.filter(b => b.userEmail === user?.email));
    setLoaded(true);
  }, []);

  const cancel = (b) => {
    if (!window.confirm("Cancel this booking?")) return;
    const all = JSON.parse(localStorage.getItem("bookings")) || [];
    const updated = all.filter(x => !(
      x.userEmail === b.userEmail && x.carName === b.carName && x.pickup === b.pickup
    ));
    localStorage.setItem("bookings", JSON.stringify(updated));
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setBookings(updated.filter(x => x.userEmail === user?.email));
  };

  const counts = {
    all: bookings.length,
    active: bookings.filter(b => getStatus(b) === "active").length,
    upcoming: bookings.filter(b => getStatus(b) === "upcoming").length,
    completed: bookings.filter(b => getStatus(b) === "completed").length,
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => getStatus(b) === filter);
  const totalSpend = bookings.reduce((s, b) => s + (b.price || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatOrb { 0%,100% { transform:translateY(0) scale(1); } 50% { transform:translateY(-30px) scale(1.05); } }
        @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#080810; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#0d0d1a; }
        ::-webkit-scrollbar-thumb { background:rgba(167,139,250,0.3); border-radius:3px; }
        @media (max-width:960px) {
          .card-grid { grid-template-columns: 1fr !important; }
          .booking-card-inner { grid-template-columns: 1fr !important; }
          .nav-inner { padding: 0 20px !important; }
          .page-padding { padding: 0 20px !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080810", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

        {/* BG ORBS */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: -100, left: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", animation: "floatOrb 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: -150, right: -100, width: 600, height: 600, background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", animation: "floatOrb 12s ease-in-out infinite reverse" }} />
          <div style={{ position: "absolute", top: "40%", left: "40%", width: 400, height: 400, background: "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)" }} />
        </div>

        {/* ── NAV ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(8,8,16,0.8)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div className="nav-inner" style={{ maxWidth: 1300, margin: "0 auto", padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Back to Home */}
            <Link
              to="/"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 500,
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#a78bfa";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)";
                e.currentTarget.style.background = "rgba(167,139,250,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to Home
            </Link>

            {/* Logo / title */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🚗</div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "white", letterSpacing: 0.5 }}>
                My <em style={{ color: "#a78bfa" }}>Bookings</em>
              </span>
            </div>

            {/* Total spend */}
            {bookings.length > 0 && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Total Spent</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>₹{totalSpend.toLocaleString()}</div>
              </div>
            )}
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="page-padding" style={{ maxWidth: 1300, margin: "0 auto", padding: "56px 48px 0", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#a78bfa", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 24, height: 1, background: "#a78bfa", display: "inline-block" }} />
              Customer Dashboard
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px,6vw,72px)", fontWeight: 700, color: "white", lineHeight: 1.05, marginBottom: 6 }}>
            Rental{" "}
            <em style={{ color: "#a78bfa", fontStyle: "italic" }}>History</em>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 300, maxWidth: 420 }}>
            All your bookings in one place — track, manage, and explore.
          </p>

          {/* ── STATS ROW ── */}
          {loaded && bookings.length > 0 && (
            <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
              {[
                { icon: "🚗", num: bookings.length, label: "Total Trips", color: "#a78bfa" },
                { icon: "⚡", num: counts.active, label: "Active Now", color: "#34d399" },
                { icon: "📅", num: counts.upcoming, label: "Upcoming", color: "#fbbf24" },
                { icon: "✓", num: counts.completed, label: "Completed", color: "#9ca3af" },
              ].map(({ icon, num, label, color }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14, padding: "16px 22px",
                  display: "flex", alignItems: "center", gap: 12,
                  flex: "1 1 auto", minWidth: 140,
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "white", lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div className="page-padding" style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 48px 80px", position: "relative", zIndex: 1 }}>

          {loaded && bookings.length === 0 ? (
            /* EMPTY STATE */
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
              <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.15 }}>🚘</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: "white", marginBottom: 10 }}>No Bookings Yet</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", fontWeight: 300, marginBottom: 32 }}>You haven't rented any cars yet. Browse our fleet and get going!</p>
              <Link to="/cars" style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "white", padding: "14px 36px",
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2,
                display: "inline-block", borderRadius: 12,
                boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
                transition: "all 0.2s",
              }}>
                Browse Cars →
              </Link>
            </div>
          ) : (
            <>
              {/* FILTER BAR */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
                  Showing <span style={{ color: "white", fontWeight: 600 }}>{filtered.length}</span> booking{filtered.length !== 1 ? "s" : ""}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { key: "all", label: "All", color: "#a78bfa" },
                    { key: "active", label: "Active", color: "#34d399" },
                    { key: "upcoming", label: "Upcoming", color: "#fbbf24" },
                    { key: "completed", label: "Completed", color: "#9ca3af" },
                  ].map(({ key, label, color }) => (
                    <FilterPill key={key} label={label} count={counts[key]} active={filter === key} onClick={() => setFilter(key)} color={color} />
                  ))}
                </div>
              </div>

              {/* DIVIDER */}
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", marginBottom: 28 }} />

              {/* CARDS */}
              {filtered.map((b, i) => (
                <BookingCard key={i} b={b} index={i} onCancel={cancel} />
              ))}

              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 36, opacity: 0.15, marginBottom: 12 }}>🔍</div>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No {filter} bookings found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}