import React, { useState, useRef } from "react";
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
    --text: #f0f0f5;
    --muted: #6b6b80;
    --sidebar-w: 240px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .admin-shell { display: flex; min-height: 100vh; }

  .admin-sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
  }

  .sidebar-brand {
    padding: 28px 24px 24px;
    border-bottom: 1px solid var(--border);
  }

  .brand-icon {
    width: 36px; height: 36px;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; margin-bottom: 12px;
    clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%);
  }

  .brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase;
  }

  .brand-sub { font-size: 10px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }

  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }

  .nav-section-label {
    font-size: 9px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--muted); padding: 8px 12px 4px; margin-top: 8px;
  }

  .nav-link {
    display: flex; align-items: center; gap: 12px; padding: 10px 14px;
    border-radius: 8px; text-decoration: none; color: var(--muted);
    font-size: 13.5px; font-weight: 500; transition: all 0.2s; position: relative;
  }
  .nav-link:hover { background: var(--surface2); color: var(--text); }
  .nav-link.active { background: rgba(230,57,70,0.12); color: var(--accent2); }
  .nav-link.active::before {
    content: ''; position: absolute; left: 0; top: 50%;
    transform: translateY(-50%); width: 3px; height: 60%;
    background: var(--accent); border-radius: 0 2px 2px 0;
  }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }

  .sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--border); }

  .admin-main { margin-left: var(--sidebar-w); flex: 1; background: var(--bg); min-height: 100vh; }

  .admin-topbar {
    padding: 20px 36px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--bg); position: sticky; top: 0; z-index: 10;
  }

  .topbar-left { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
  .topbar-left span { color: var(--text); font-weight: 500; }
  .topbar-right { display: flex; align-items: center; gap: 16px; }
  .topbar-badge {
    background: rgba(230,57,70,0.15); color: var(--accent2);
    font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
  }
  .admin-avatar {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--accent), #7b2d8b);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white;
  }

  .admin-page { padding: 36px; }

  .page-header { margin-bottom: 36px; }
  .page-header h1 {
    font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
    letter-spacing: -0.5px; margin-bottom: 6px;
  }
  .page-header p { color: var(--muted); font-size: 14px; }

  /* ── FORM LAYOUT ── */
  .addcar-layout {
    display: grid; grid-template-columns: 1fr 380px; gap: 24px;
    align-items: start;
  }

  .form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
  }

  .form-card-title {
    font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
    margin-bottom: 6px;
  }

  .form-card-sub { color: var(--muted); font-size: 13px; margin-bottom: 28px; }

  .field { margin-bottom: 20px; }

  .field label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--muted); margin-bottom: 8px;
  }

  .field input {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 13px 16px;
    color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field input::placeholder { color: var(--muted); }

  .field input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230,57,70,0.12);
  }

  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .submit-btn {
    width: 100%;
    background: var(--accent);
    color: white; border: none;
    border-radius: 10px;
    padding: 15px;
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .submit-btn:hover { background: #c1121f; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(230,57,70,0.3); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── PREVIEW CARD ── */
  .preview-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    position: sticky; top: 80px;
  }

  .preview-label {
    font-size: 10px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--muted);
    padding: 16px 20px 12px;
    border-bottom: 1px solid var(--border);
  }

  .preview-img-wrap {
    height: 200px; background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }

  .preview-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

  .preview-placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    color: var(--muted);
  }

  .preview-placeholder span { font-size: 32px; }
  .preview-placeholder p { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }

  .preview-info { padding: 20px; }

  .preview-name {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
    margin-bottom: 6px; color: var(--text);
  }

  .preview-price { color: var(--accent2); font-size: 15px; font-weight: 600; margin-bottom: 16px; }

  .preview-tags { display: flex; flex-wrap: wrap; gap: 6px; }

  .preview-tag {
    font-size: 10px; font-weight: 600; letter-spacing: 1px;
    text-transform: uppercase; padding: 4px 10px;
    border-radius: 20px; background: rgba(255,255,255,0.05);
    color: var(--muted);
  }

  /* ── SUCCESS TOAST ── */
  .success-toast {
    position: fixed; bottom: 28px; right: 28px;
    background: #0f1f14; border: 1px solid #3ecf8e;
    border-radius: 12px; padding: 14px 20px;
    display: flex; align-items: center; gap: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: slideUp 0.3s ease;
    z-index: 1000;
  }

  .toast-dot { width: 8px; height: 8px; background: #3ecf8e; border-radius: 50%; }
  .toast-text { font-size: 13px; color: #3ecf8e; font-weight: 500; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const NAV = [
  { to: "/admin", icon: "▦", label: "Dashboard" },
  { to: "/addcar", icon: "＋", label: "Add Car" },
  { to: "/managecars", icon: "≡", label: "Manage Cars" },
];

export default function AddCar({ cars, setCars }) {
  const location = useLocation();
  const [form, setForm] = useState({ name: "", price: "", image: "", fuel: "", seats: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleAddCar = () => {
    if (!form.name || !form.price || !form.image) { alert("Name, price and image are required."); return; }
    setLoading(true);
    setTimeout(() => {
      const newCar = { id: Date.now(), ...form, price: Number(form.price) };
      setCars([...cars, newCar]);
      setForm({ name: "", price: "", image: "", fuel: "", seats: "" });
      setLoading(false);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    }, 700);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="admin-shell">
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
            <Link to="/" className="nav-link"><span className="nav-icon">←</span>Back to Website</Link>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div className="topbar-left">Admin / <span>Add Car</span></div>
            <div className="topbar-right">
              <span className="topbar-badge">● Live</span>
              <div className="admin-avatar">A</div>
            </div>
          </div>

          <div className="admin-page">
            <div className="page-header">
              <h1>Add New Car</h1>
              <p>Fill in the details to list a new vehicle in your fleet.</p>
            </div>

            <div className="addcar-layout">
              {/* FORM */}
              <div className="form-card">
                <div className="form-card-title">Vehicle Details</div>
                <div className="form-card-sub">All fields marked with * are required</div>

                <div className="field">
                  <label>Car Name *</label>
                  <input placeholder="e.g. Toyota Innova Crysta" value={form.name} onChange={update("name")} />
                </div>

                <div className="field">
                  <label>Image URL *</label>
                  <input placeholder="https://example.com/car.jpg" value={form.image} onChange={update("image")} />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Price / Day (₹) *</label>
                    <input type="number" placeholder="1500" value={form.price} onChange={update("price")} />
                  </div>
                  <div className="field">
                    <label>Seating Capacity</label>
                    <input type="number" placeholder="5" value={form.seats} onChange={update("seats")} />
                  </div>
                </div>

                <div className="field">
                  <label>Fuel Type</label>
                  <input placeholder="Petrol / Diesel / Electric / CNG" value={form.fuel} onChange={update("fuel")} />
                </div>

                <button className="submit-btn" onClick={handleAddCar} disabled={loading}>
                  {loading ? "Adding..." : <><span>+</span> Add to Fleet</>}
                </button>
              </div>

              {/* PREVIEW */}
              <div className="preview-card">
                <div className="preview-label">Live Preview</div>
                <div className="preview-img-wrap">
                  {form.image ? (
                    <img src={form.image} alt="preview" onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="preview-placeholder">
                      <span>🚗</span>
                      <p>Image preview</p>
                    </div>
                  )}
                </div>
                <div className="preview-info">
                  <div className="preview-name">{form.name || "Car Name"}</div>
                  <div className="preview-price">
                    {form.price ? `₹${Number(form.price).toLocaleString()} / day` : "₹— / day"}
                  </div>
                  <div className="preview-tags">
                    {form.fuel && <span className="preview-tag">{form.fuel}</span>}
                    {form.seats && <span className="preview-tag">{form.seats} Seats</span>}
                    <span className="preview-tag">Insurance ✓</span>
                    <span className="preview-tag">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div className="success-toast">
          <div className="toast-dot" />
          <div className="toast-text">Car added to fleet successfully!</div>
        </div>
      )}
    </>
  );
}