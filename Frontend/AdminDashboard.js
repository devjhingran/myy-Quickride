import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #16161f;
    --border: rgba(255,255,255,0.06);
    --accent: #e63946;
    --accent2: #ff6b6b;
    --gold: #f4c542;
    --green: #3ecf8e;
    --text: #f0f0f5;
    --muted: #6b6b80;
    --sidebar-w: 240px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .admin-shell { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .admin-sidebar {
    width: var(--sidebar-w); background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
  }
  .sidebar-brand { padding: 28px 24px 24px; border-bottom: 1px solid var(--border); }
  .brand-icon {
    width: 36px; height: 36px; background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; margin-bottom: 12px;
    clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%);
  }
  .brand-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--text); }
  .brand-sub { font-size: 10px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-section-label { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); padding: 8px 12px 4px; margin-top: 8px; }
  .nav-link { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; text-decoration: none; color: var(--muted); font-size: 13.5px; font-weight: 500; transition: all 0.2s; position: relative; }
  .nav-link:hover { background: var(--surface2); color: var(--text); }
  .nav-link.active { background: rgba(230,57,70,0.12); color: var(--accent2); }
  .nav-link.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent); border-radius: 0 2px 2px 0; }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--border); }

  /* MAIN */
  .admin-main { margin-left: var(--sidebar-w); flex: 1; background: var(--bg); min-height: 100vh; }
  .admin-topbar { padding: 20px 36px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(12px); }
  .topbar-left { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); letter-spacing: 0.5px; }
  .topbar-left span { color: var(--text); font-weight: 500; }
  .topbar-right { display: flex; align-items: center; gap: 16px; }
  .topbar-badge { background: rgba(230,57,70,0.15); color: var(--accent2); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; }
  .admin-avatar { width: 34px; height: 34px; background: linear-gradient(135deg, var(--accent), #7b2d8b); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; }

  /* PAGE */
  .admin-page { padding: 36px; }
  .page-header { margin-bottom: 36px; }
  .page-header h1 { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; }
  .page-header p { color: var(--muted); font-size: 14px; }

  /* TABS */
  .tab-bar { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 4px; margin-bottom: 32px; width: fit-content; }
  .tab-btn { padding: 9px 22px; border-radius: 7px; border: none; background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
  .tab-btn.active { background: var(--accent); color: white; }
  .tab-btn:hover:not(.active) { background: var(--surface2); color: var(--text); }

  /* STAT CARDS */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px 22px; transition: transform 0.2s, border-color 0.2s; }
  .stat-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.1); }
  .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .stat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 6px; }
  .stat-change { font-size: 11px; color: #3ecf8e; font-weight: 500; }

  /* FILTERS */
  .filter-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  .filter-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .filter-pill { padding: 7px 16px; border-radius: 999px; border: 1.5px solid var(--border); background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .filter-pill:hover { border-color: rgba(255,255,255,0.15); color: var(--text); }
  .filter-pill.active { border-color: var(--accent); background: rgba(230,57,70,0.12); color: var(--accent2); }
  .filter-sep { width: 1px; height: 24px; background: var(--border); }

  /* TABLE */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .table-header { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .table-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
  .table-count { font-size: 12px; color: var(--muted); background: var(--surface2); padding: 4px 12px; border-radius: 20px; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: var(--surface2); }
  thead th { padding: 12px 16px; text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
  tbody tr { border-top: 1px solid var(--border); transition: background 0.15s; }
  tbody tr:hover { background: rgba(255,255,255,0.03); }
  tbody td { padding: 14px 16px; font-size: 13px; color: rgba(255,255,255,0.75); vertical-align: middle; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; }
  .badge-active { background: rgba(62,207,142,0.12); color: #3ecf8e; }
  .badge-upcoming { background: rgba(244,197,66,0.12); color: var(--gold); }
  .badge-completed { background: rgba(107,107,128,0.15); color: var(--muted); }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* USER AVATAR */
  .user-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #7b2d8b); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: white; flex-shrink: 0; }

  /* EMPTY */
  .empty-state { padding: 60px; text-align: center; color: var(--muted); }
  .empty-state div { font-size: 36px; margin-bottom: 12px; opacity: 0.3; }
  .empty-state p { font-size: 13px; }

  /* ACTION GRID (Dashboard tab) */
  .action-section-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 16px; color: var(--text); }
  .action-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 36px; }
  .action-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px; transition: all 0.25s; position: relative; overflow: hidden; text-decoration: none; display: block; }
  .action-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-accent, var(--accent)); opacity: 0; transition: opacity 0.25s; }
  .action-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.1); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
  .action-card:hover::after { opacity: 1; }
  .action-emoji { font-size: 28px; margin-bottom: 16px; display: block; }
  .action-card h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
  .action-card p { font-size: 13px; color: var(--muted); line-height: 1.55; }
  .action-arrow { position: absolute; bottom: 24px; right: 24px; width: 28px; height: 28px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--muted); transition: all 0.2s; }
  .action-card:hover .action-arrow { background: var(--card-accent, var(--accent)); color: white; }
  .overview-box { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px; display: flex; gap: 32px; align-items: flex-start; }
  .overview-icon { width: 48px; height: 48px; flex-shrink: 0; background: rgba(244,197,66,0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .overview-box h2 { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 8px; }
  .overview-box p { font-size: 13.5px; color: var(--muted); line-height: 1.65; }

  @media (max-width: 900px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .action-grid { grid-template-columns: 1fr; }
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .anim { animation: fadeIn 0.35s ease both; }
`;

const NAV = [
  { to: "/admin",       icon: "▦", label: "Dashboard" },
  { to: "/addcar",      icon: "＋", label: "Add Car" },
  { to: "/managecars",  icon: "≡", label: "Manage Cars" },
];

const ACTIONS = [
  { to: "/addcar",      emoji: "🚗", title: "Add New Car",    desc: "List a new vehicle in your rental inventory with pricing and images.", accent: "#e63946" },
  { to: "/managecars",  emoji: "📋", title: "Manage Cars",    desc: "Edit details, update pricing, or remove vehicles from the system.", accent: "#3ecf8e" },
  { to: "/",            emoji: "🌐", title: "Visit Website",  desc: "Preview your live rental storefront as customers see it.", accent: "#f4c542" },
];

/* ── HELPERS ── */
function getStatus(b) {
  const today = new Date(); today.setHours(0,0,0,0);
  const pickup  = new Date(b.pickup);
  const ret     = new Date(b.returnDate);
  if (today >= pickup && today <= ret) return "active";
  if (today < pickup) return "upcoming";
  return "completed";
}

function isToday(dateStr) {
  const d = new Date(dateStr); const t = new Date();
  return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
}
function isYesterday(dateStr) {
  const d = new Date(dateStr); const t = new Date(); t.setDate(t.getDate()-1);
  return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
}
function isLastMonth(dateStr) {
  const d = new Date(dateStr); const t = new Date();
  const lm = new Date(t.getFullYear(), t.getMonth()-1, 1);
  return d.getMonth()===lm.getMonth() && d.getFullYear()===lm.getFullYear();
}

const LOCATION_FILTERS = ["All Locations","Delhi","Haryana","Uttar Pradesh"];
const DATE_FILTERS      = ["All Time","Today","Yesterday","Last Month"];

/* ── STATUS BADGE ── */
function StatusBadge({ status }) {
  const cfg = {
    active:    { cls: "badge-active",    label: "Active"     },
    upcoming:  { cls: "badge-upcoming",  label: "Upcoming"   },
    completed: { cls: "badge-completed", label: "Completed"  },
  };
  const c = cfg[status] || cfg.completed;
  return <span className={`badge ${c.cls}`}><span className="badge-dot"/>{c.label}</span>;
}

export default function AdminDashboard() {
  const location = useLocation();
  const [mounted,   setMounted]   = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // raw data
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers,    setAllUsers]    = useState([]);

  // filters
  const [dateFilter, setDateFilter]  = useState("All Time");
  const [locFilter,  setLocFilter]   = useState("All Locations");

  useEffect(() => {
    setMounted(true);
    setAllBookings(JSON.parse(localStorage.getItem("bookings")) || []);
    setAllUsers(JSON.parse(localStorage.getItem("users"))    || []);
  }, []);

  /* ── FILTER LOGIC ── */
  const applyFilters = (list) => {
    let res = [...list];

    // date filter on pickup date
    if (dateFilter === "Today")      res = res.filter(b => isToday(b.pickup));
    if (dateFilter === "Yesterday")  res = res.filter(b => isYesterday(b.pickup));
    if (dateFilter === "Last Month") res = res.filter(b => isLastMonth(b.pickup));

    // location filter on pickupState
    if (locFilter !== "All Locations") {
      res = res.filter(b => {
        const state = (b.pickupState || b.address || "").toLowerCase();
        return state.toLowerCase().includes(locFilter.toLowerCase());
      });
    }
    return res;
  };

  const filteredBookings = applyFilters(allBookings);

  /* ── LIVE STATS (from actual data) ── */
  const totalRevenue = allBookings.reduce((s,b) => s + (Number(b.price)||0), 0);
  const cars = JSON.parse(localStorage.getItem("cars")) || [];

  const stats = [
    { label: "Total Cars",       value: cars.length,           change: "in fleet",             icon: "🚗", color: "rgba(230,57,70,0.15)"    },
    { label: "Total Bookings",   value: allBookings.length,    change: "all time",             icon: "📅", color: "rgba(62,207,142,0.12)"   },
    { label: "Revenue",          value: `₹${(totalRevenue/1000).toFixed(1)}K`, change: "total collected", icon: "💰", color: "rgba(244,197,66,0.12)"   },
    { label: "Registered Users", value: allUsers.length,       change: "on platform",          icon: "👤", color: "rgba(100,130,255,0.12)"  },
  ];

  /* ── ENRICH bookings with user name ── */
  const enriched = filteredBookings.map(b => ({
    ...b,
    userName: allUsers.find(u => u.email === b.userEmail)?.name || b.name || "—",
  }));

  return (
    <>
      <style>{styles}</style>
      <div className="admin-shell">

        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">⚙</div>
            <div className="brand-name">QuickRide</div>
            <div className="brand-sub">Admin Console</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Navigation</div>
            {NAV.map(n => (
              <Link key={n.to} to={n.to} className={`nav-link${location.pathname === n.to ? " active" : ""}`}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-footer">
            <Link to="/" className="nav-link">
              <span className="nav-icon">←</span>Back to Website
            </Link>
          </div>
        </aside>

        {/* MAIN */}
        <main className="admin-main">
          <div className="admin-topbar">
            <div className="topbar-left">Admin / <span>{activeTab === "dashboard" ? "Dashboard" : activeTab === "bookings" ? "Bookings" : "Users"}</span></div>
            <div className="topbar-right">
              <span className="topbar-badge">● Live</span>
              <div className="admin-avatar">A</div>
            </div>
          </div>

          <div className="admin-page" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s" }}>

            <div className="page-header">
              <h1>{activeTab === "dashboard" ? "Dashboard" : activeTab === "bookings" ? "All Bookings" : "All Users"}</h1>
              <p>
                {activeTab === "dashboard"
                  ? "Welcome back — here's what's happening with your fleet."
                  : activeTab === "bookings"
                  ? "View, filter and manage all customer bookings."
                  : "View all registered users and their activity."}
              </p>
            </div>

            {/* TABS */}
            <div className="tab-bar">
              {[["dashboard","▦ Dashboard"],["bookings","📅 Bookings"],["users","👤 Users"]].map(([key,label]) => (
                <button key={key} className={`tab-btn${activeTab===key?" active":""}`} onClick={() => setActiveTab(key)}>
                  {label}
                </button>
              ))}
            </div>

            {/* ══════════ DASHBOARD TAB ══════════ */}
            {activeTab === "dashboard" && (
              <div className="anim">
                {/* STATS */}
                <div className="stat-grid">
                  {stats.map((s,i) => (
                    <div className="stat-card" key={i}>
                      <div className="stat-top">
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
                      </div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-change">↑ {s.change}</div>
                    </div>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="action-section-title">Quick Actions</div>
                <div className="action-grid">
                  {ACTIONS.map((a,i) => (
                    <Link to={a.to} className="action-card" key={i} style={{ "--card-accent": a.accent }}>
                      <span className="action-emoji">{a.emoji}</span>
                      <h3>{a.title}</h3>
                      <p>{a.desc}</p>
                      <div className="action-arrow">→</div>
                    </Link>
                  ))}
                </div>

                {/* OVERVIEW */}
                <div className="overview-box">
                  <div className="overview-icon">📊</div>
                  <div>
                    <h2>System Overview</h2>
                    <p>
                      Your admin panel gives you full control over the QuickRide rental platform.
                      Use the <strong>Bookings</strong> tab to filter bookings by date (Today / Yesterday / Last Month)
                      and by location (Delhi / Haryana / UP). Use the <strong>Users</strong> tab to see all
                      registered customers and their booking history.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ BOOKINGS TAB ══════════ */}
            {activeTab === "bookings" && (
              <div className="anim">

                {/* FILTER BAR */}
                <div className="filter-bar">
                  <span className="filter-label">📅 Date:</span>
                  {DATE_FILTERS.map(f => (
                    <button key={f} className={`filter-pill${dateFilter===f?" active":""}`} onClick={() => setDateFilter(f)}>{f}</button>
                  ))}
                  <div className="filter-sep" />
                  <span className="filter-label">📍 Location:</span>
                  {LOCATION_FILTERS.map(f => (
                    <button key={f} className={`filter-pill${locFilter===f?" active":""}`} onClick={() => setLocFilter(f)}>{f}</button>
                  ))}
                </div>

                <div className="table-wrap">
                  <div className="table-header">
                    <span className="table-title">Bookings</span>
                    <span className="table-count">{enriched.length} result{enriched.length !== 1 ? "s" : ""}</span>
                  </div>

                  {enriched.length === 0 ? (
                    <div className="empty-state"><div>📋</div><p>No bookings found for selected filters.</p></div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Customer</th>
                          <th>Car</th>
                          <th>Pickup Location</th>
                          <th>State</th>
                          <th>Pickup Date</th>
                          <th>Return Date</th>
                          <th>Days</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enriched.map((b, i) => (
                          <tr key={i}>
                            <td style={{ color: "var(--muted)", fontWeight: 600 }}>#{String(i+1).padStart(3,"0")}</td>
                            <td>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div className="user-avatar">{(b.userName||"?")[0].toUpperCase()}</div>
                                <div>
                                  <div style={{ fontWeight:600, fontSize:13, color:"var(--text)" }}>{b.userName}</div>
                                  <div style={{ fontSize:11, color:"var(--muted)" }}>{b.userEmail||b.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight:600 }}>{b.carName}</td>
                            <td>{b.pickupLocation || b.address || "—"}</td>
                            <td>
                              <span style={{ background:"var(--surface2)", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 }}>
                                {b.pickupState || "—"}
                              </span>
                            </td>
                            <td>{b.pickup}</td>
                            <td>{b.returnDate}</td>
                            <td style={{ textAlign:"center" }}>{b.days}</td>
                            <td style={{ color:"var(--gold)", fontWeight:700 }}>₹{Number(b.price).toLocaleString()}</td>
                            <td><StatusBadge status={getStatus(b)} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* SUMMARY ROW */}
                {enriched.length > 0 && (
                  <div style={{ marginTop:16, display:"flex", gap:24, padding:"14px 20px", background:"var(--surface)", borderRadius:10, border:"1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>Filtered Revenue</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"var(--gold)" }}>
                        ₹{enriched.reduce((s,b)=>s+(Number(b.price)||0),0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ width:1, background:"var(--border)" }}/>
                    <div>
                      <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>Active</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"var(--green)" }}>
                        {enriched.filter(b=>getStatus(b)==="active").length}
                      </div>
                    </div>
                    <div style={{ width:1, background:"var(--border)" }}/>
                    <div>
                      <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>Upcoming</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"var(--gold)" }}>
                        {enriched.filter(b=>getStatus(b)==="upcoming").length}
                      </div>
                    </div>
                    <div style={{ width:1, background:"var(--border)" }}/>
                    <div>
                      <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>Completed</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"var(--muted)" }}>
                        {enriched.filter(b=>getStatus(b)==="completed").length}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══════════ USERS TAB ══════════ */}
            {activeTab === "users" && (
              <div className="anim">
                <div className="table-wrap">
                  <div className="table-header">
                    <span className="table-title">Registered Users</span>
                    <span className="table-count">{allUsers.length} user{allUsers.length !== 1 ? "s" : ""}</span>
                  </div>

                  {allUsers.length === 0 ? (
                    <div className="empty-state"><div>👤</div><p>No users registered yet.</p></div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Total Bookings</th>
                          <th>Total Spent</th>
                          <th>Locations Used</th>
                          <th>Last Booking</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((u, i) => {
                          const userBookings = allBookings.filter(b => b.userEmail === u.email);
                          const totalSpent   = userBookings.reduce((s,b) => s+(Number(b.price)||0), 0);
                          const locations    = [...new Set(userBookings.map(b => b.pickupState).filter(Boolean))];
                          const lastBooking  = userBookings.length > 0 ? userBookings[userBookings.length-1].pickup : null;
                          return (
                            <tr key={i}>
                              <td style={{ color:"var(--muted)", fontWeight:600 }}>#{String(i+1).padStart(3,"0")}</td>
                              <td>
                                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                  <div className="user-avatar">{u.name[0].toUpperCase()}</div>
                                  <span style={{ fontWeight:600, color:"var(--text)" }}>{u.name}</span>
                                </div>
                              </td>
                              <td style={{ color:"var(--muted)" }}>{u.email}</td>
                              <td style={{ textAlign:"center" }}>
                                <span style={{ background:"rgba(230,57,70,0.12)", color:"var(--accent2)", padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
                                  {userBookings.length}
                                </span>
                              </td>
                              <td style={{ color:"var(--gold)", fontWeight:700 }}>
                                {totalSpent > 0 ? `₹${totalSpent.toLocaleString()}` : "—"}
                              </td>
                              <td>
                                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                                  {locations.length > 0
                                    ? locations.map(l => (
                                        <span key={l} style={{ background:"var(--surface2)", padding:"2px 8px", borderRadius:6, fontSize:11, color:"rgba(255,255,255,0.6)" }}>{l}</span>
                                      ))
                                    : <span style={{ color:"var(--muted)" }}>—</span>
                                  }
                                </div>
                              </td>
                              <td style={{ color:"var(--muted)" }}>{lastBooking || "No bookings yet"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}