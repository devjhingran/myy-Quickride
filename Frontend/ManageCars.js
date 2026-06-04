import React, { useState } from "react";
import ReactDOM from "react-dom";
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
    --green: #3ecf8e;
    --text: #f0f0f5;
    --muted: #6b6b80;
    --sidebar-w: 240px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .admin-shell { display: flex; min-height: 100vh; }

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

  .brand-name {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase;
  }
  .brand-sub { font-size: 10px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }

  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-section-label {
    font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    color: var(--muted); padding: 8px 12px 4px; margin-top: 8px;
  }
  .nav-link {
    display: flex; align-items: center; gap: 12px; padding: 10px 14px;
    border-radius: 8px; text-decoration: none; color: var(--muted);
    font-size: 13.5px; font-weight: 500; transition: all 0.2s; position: relative;
  }
  .nav-link:hover { background: var(--surface2); color: var(--text); }
  .nav-link.active { background: rgba(230,57,70,0.12); color: var(--accent2); }
  .nav-link.active::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 60%; background: var(--accent); border-radius: 0 2px 2px 0;
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
  .page-header { margin-bottom: 28px; display: flex; align-items: flex-end; justify-content: space-between; }
  .page-header h1 {
    font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
    letter-spacing: -0.5px; margin-bottom: 6px;
  }
  .page-header p { color: var(--muted); font-size: 14px; }

  .fleet-count {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    color: var(--muted); padding: 8px 16px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px;
  }
  .fleet-count strong { color: var(--text); }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center; padding: 80px 40px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
  }
  .empty-state span { font-size: 48px; display: block; margin-bottom: 16px; }
  .empty-state h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .empty-state p { color: var(--muted); font-size: 14px; margin-bottom: 20px; }

  .btn-add-link {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: white; text-decoration: none;
    padding: 11px 20px; border-radius: 8px;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.5px; transition: all 0.2s;
  }
  .btn-add-link:hover { background: #c1121f; transform: translateY(-1px); }

  /* ── CAR TABLE ── */
  .table-wrap {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
  }

  .table-header {
    display: grid; grid-template-columns: 80px 1fr 110px 110px 120px;
    padding: 12px 20px;
    background: var(--surface2); border-bottom: 1px solid var(--border);
    font-size: 10px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--muted);
  }

  .car-row {
    display: grid; grid-template-columns: 80px 1fr 110px 110px 120px;
    padding: 16px 20px; align-items: center;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .car-row:last-child { border-bottom: none; }
  .car-row:hover { background: rgba(255,255,255,0.02); }

  .car-thumb {
    width: 64px; height: 44px; border-radius: 6px; object-fit: cover;
    background: var(--surface2);
  }

  .car-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .car-id { font-size: 10px; color: var(--muted); letter-spacing: 1px; }

  .car-price { font-size: 14px; font-weight: 600; color: var(--accent2); }
  .car-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; padding: 3px 10px;
    border-radius: 20px; background: rgba(62,207,142,0.1); color: var(--green);
  }
  .car-status::before { content: ''; width: 5px; height: 5px; background: var(--green); border-radius: 50%; }

  .row-actions { display: flex; gap: 8px; }

  .btn-edit {
    padding: 7px 14px; background: rgba(255,255,255,0.05);
    border: 1px solid var(--border); border-radius: 7px;
    color: var(--text); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-edit:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15); }

  .btn-delete {
    padding: 7px 12px; background: rgba(230,57,70,0.08);
    border: 1px solid rgba(230,57,70,0.2); border-radius: 7px;
    color: var(--accent2); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-delete:hover { background: rgba(230,57,70,0.15); border-color: rgba(230,57,70,0.4); }

  /* ── PORTAL MODAL — rendered into document.body ── */
  .mc-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.82);
    display: flex; align-items: center; justify-content: center;
    z-index: 999999; padding: 20px;
    animation: mcFadeIn 0.2s ease;
  }
  @keyframes mcFadeIn { from { opacity: 0; } to { opacity: 1; } }

  .mc-modal {
    background: var(--surface); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; padding: 32px; width: 100%; max-width: 480px;
    animation: mcSlideIn 0.25s ease;
  }
  @keyframes mcSlideIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .mc-modal-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
  }
  .mc-modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--text); }
  .mc-modal-close {
    width: 32px; height: 32px; background: rgba(255,255,255,0.05);
    border: none; border-radius: 8px; color: var(--muted);
    font-size: 16px; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .mc-modal-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }

  .mc-field { margin-bottom: 16px; }
  .mc-field label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 7px;
  }
  .mc-field input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 9px; padding: 12px 14px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .mc-field input:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(230,57,70,0.12);
  }

  .mc-modal-actions { display: flex; gap: 10px; margin-top: 24px; }

  .mc-btn-update {
    flex: 1; background: var(--accent); color: white; border: none;
    border-radius: 9px; padding: 13px;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s;
  }
  .mc-btn-update:hover { background: #c1121f; }

  .mc-btn-cancel {
    padding: 13px 20px; background: transparent;
    border: 1px solid var(--border); border-radius: 9px;
    color: var(--muted); font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .mc-btn-cancel:hover { background: rgba(255,255,255,0.04); color: var(--text); }

  /* ── TOAST ── */
  .success-toast {
    position: fixed; bottom: 28px; right: 28px;
    background: #0f1f14; border: 1px solid #3ecf8e; border-radius: 12px;
    padding: 14px 20px; display: flex; align-items: center; gap: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; z-index: 1000000;
  }
  .toast-dot { width: 8px; height: 8px; background: #3ecf8e; border-radius: 50%; }
  .toast-text { font-size: 13px; color: #3ecf8e; font-weight: 500; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const NAV = [
  { to: "/admin",      icon: "▦", label: "Dashboard"  },
  { to: "/addcar",     icon: "＋", label: "Add Car"    },
  { to: "/managecars", icon: "≡", label: "Manage Cars" },
];

/* ── Portal Edit Modal ── */
function EditModal({ form, onUpdate, onClose, onChange }) {
  return ReactDOM.createPortal(
    <div
      className="mc-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="mc-modal">
        <div className="mc-modal-header">
          <div className="mc-modal-title">Edit Vehicle</div>
          <button className="mc-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="mc-field">
          <label>Car Name</label>
          <input value={form.name} onChange={onChange("name")} placeholder="Toyota Innova" />
        </div>
        <div className="mc-field">
          <label>Image URL</label>
          <input value={form.image} onChange={onChange("image")} placeholder="https://..." />
        </div>
        <div className="mc-field">
          <label>Price / Day (₹)</label>
          <input type="number" value={form.price} onChange={onChange("price")} placeholder="1500" />
        </div>

        <div className="mc-modal-actions">
          <button className="mc-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="mc-btn-update" onClick={onUpdate}>Save Changes →</button>
        </div>
      </div>
    </div>,
    document.body   // ← escapes sidebar's stacking context completely
  );
}

export default function ManageCars({ cars, setCars }) {
  const location = useLocation();
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState({ name: "", price: "", image: "" });
  const [toast,  setToast]  = useState("");

  const onChange = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const deleteCar = (id) => {
    if (!window.confirm("Remove this car from the fleet?")) return;
    setCars(cars.filter(c => c.id !== id));
    showToast("Car removed from fleet.");
  };

  const startEdit = (car) => {
    setForm({ name: car.name, price: car.price, image: car.image });
    setEditId(car.id);
  };

  const updateCar = () => {
    setCars(cars.map(c => c.id === editId ? { ...c, ...form, price: Number(form.price) } : c));
    setEditId(null);
    showToast("Car updated successfully.");
  };

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
            <Link to="/" className="nav-link"><span className="nav-icon">←</span>Back to Website</Link>
          </div>
        </aside>

        {/* MAIN */}
        <main className="admin-main">
          <div className="admin-topbar">
            <div className="topbar-left">Admin / <span>Manage Cars</span></div>
            <div className="topbar-right">
              <span className="topbar-badge">● Live</span>
              <div className="admin-avatar">A</div>
            </div>
          </div>

          <div className="admin-page">
            <div className="page-header">
              <div>
                <h1>Manage Fleet</h1>
                <p>Edit, update or remove vehicles from your rental system.</p>
              </div>
              <div className="fleet-count"><strong>{cars.length}</strong> vehicles</div>
            </div>

            {cars.length === 0 ? (
              <div className="empty-state">
                <span>🚗</span>
                <h3>No Cars Yet</h3>
                <p>Your fleet is empty. Add your first car to get started.</p>
                <Link to="/addcar" className="btn-add-link">+ Add First Car</Link>
              </div>
            ) : (
              <div className="table-wrap">
                <div className="table-header">
                  <div>Photo</div>
                  <div>Vehicle</div>
                  <div>Price/Day</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>

                {cars.map(car => (
                  <div className="car-row" key={car.id}>
                    <div>
                      <img
                        className="car-thumb" src={car.image} alt={car.name}
                        onError={(e) => { e.target.src = ""; e.target.style.background = "#1a1a24"; }}
                      />
                    </div>
                    <div>
                      <div className="car-name">{car.name}</div>
                      <div className="car-id">ID #{car.id.toString().slice(-5)}</div>
                    </div>
                    <div className="car-price">₹{Number(car.price).toLocaleString()}</div>
                    <div><span className="car-status">Active</span></div>
                    <div className="row-actions">
                      <button className="btn-edit" onClick={() => startEdit(car)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteCar(car.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Portal modal — mounts directly on document.body */}
      {editId && (
        <EditModal
          form={form}
          onChange={onChange}
          onUpdate={updateCar}
          onClose={() => setEditId(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="success-toast">
          <div className="toast-dot" />
          <div className="toast-text">{toast}</div>
        </div>
      )}
    </>
  );
}