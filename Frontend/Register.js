import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

:root {
  --ink: #0c0c0e;
  --paper: #f5f2eb;
  --paper2: #edeae0;
  --red: #e63946;
  --muted: #888880;
  --green: #2a9d3f;
  --amber: #e8a000;
  --font-display: 'Playfair Display', serif;
  --font-hero: 'Bebas Neue', sans-serif;
  --font-body: 'Outfit', sans-serif;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family: var(--font-body); background: var(--paper); color: var(--ink); }

.auth-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* ── LEFT ── */
.auth-left {
  background: var(--ink);
  padding: 72px 64px;
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative; overflow: hidden;
}

.auth-left-bg-num {
  position: absolute; bottom: -30px; left: 40px;
  font-family: var(--font-hero); font-size: 300px; line-height: 1;
  color: rgba(230,57,70,0.06); pointer-events: none; user-select: none; letter-spacing: -8px;
}

.auth-left-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.auth-logo {
  font-family: var(--font-hero); font-size: 20px; letter-spacing: 3px;
  color: white; margin-bottom: 0;
}
.auth-logo em { color: var(--red); font-style: normal; }

.auth-left-body { position: relative; z-index: 1; }

.auth-step-label {
  font-size: 9px; font-weight: 700; letter-spacing: 3.5px; text-transform: uppercase;
  color: var(--red); margin-bottom: 20px;
  display: flex; align-items: center; gap: 10px;
}
.auth-step-label::before { content:''; width:20px; height:1px; background:var(--red); display:inline-block; }

.auth-headline {
  font-family: var(--font-hero); font-size: clamp(52px, 6vw, 80px);
  color: white; letter-spacing: 2px; line-height: 0.9;
  margin-bottom: 28px;
}

.auth-headline em {
  font-family: var(--font-display); font-style: italic; color: var(--red);
  font-size: clamp(44px, 5vw, 68px); display: block;
}

.auth-tagline {
  font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.45);
  font-weight: 300; max-width: 380px;
}

.auth-perks {
  list-style: none; display: flex; flex-direction: column; gap: 12px;
  position: relative; z-index: 1;
}

.auth-perk {
  display: flex; align-items: center; gap: 12px;
  font-size: 12.5px; color: rgba(255,255,255,0.5); font-weight: 300;
}

.perk-check {
  width: 18px; height: 18px; background: rgba(230,57,70,0.15);
  border: 1px solid rgba(230,57,70,0.3);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-size: 9px; color: var(--red); font-weight: 700;
}

/* ── RIGHT ── */
.auth-right {
  background: var(--paper);
  padding: 72px 64px;
  display: flex; flex-direction: column; justify-content: center;
}

.auth-form-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
  color: var(--red); margin-bottom: 12px;
  display: flex; align-items: center; gap: 8px;
}
.auth-form-eyebrow::before { content:''; width:16px; height:1px; background:var(--red); display:inline-block; }

.auth-form-title {
  font-family: var(--font-display); font-size: 34px; font-weight: 900; font-style: italic;
  color: var(--ink); margin-bottom: 6px; line-height: 1.1;
}

.auth-form-sub {
  font-size: 13px; color: var(--muted); margin-bottom: 40px; font-weight: 300;
}

.field { margin-bottom: 18px; }

.field label {
  display: block; font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--muted); margin-bottom: 8px;
}

.field input {
  width: 100%; background: white;
  border: 1px solid rgba(12,12,14,0.14);
  border-bottom: 2px solid rgba(12,12,14,0.14);
  padding: 14px 18px; color: var(--ink);
  font-family: var(--font-body); font-size: 14px;
  outline: none; transition: all 0.22s;
}
.field input::placeholder { color: rgba(12,12,14,0.3); }
.field input:focus { border-bottom-color: var(--red); background: #fffef9; }

/* PASSWORD STRENGTH */
.strength-bars { display: flex; gap: 5px; height: 3px; margin-bottom: 7px; }
.strength-bar { flex: 1; border-radius: 2px; transition: background 0.3s; }
.strength-text { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }

/* SUBMIT */
.btn-auth {
  width: 100%; background: var(--ink); color: white; border: none;
  padding: 17px 32px; margin-top: 8px;
  font-family: var(--font-hero); font-size: 18px; letter-spacing: 3px;
  cursor: pointer; transition: all 0.25s;
  clip-path: polygon(0 0, 96% 0, 100% 16%, 100% 100%, 4% 100%, 0 84%);
  display: flex; align-items: center; justify-content: center; gap: 10px;
}

.btn-auth:hover { background: var(--red); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(230,57,70,0.25); }
.btn-auth:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.auth-switch {
  margin-top: 20px; text-align: center;
  font-size: 12.5px; color: var(--muted); font-weight: 300;
}
.auth-switch a { color: var(--ink); font-weight: 600; text-decoration: none; border-bottom: 1px solid rgba(12,12,14,0.25); transition: border-color 0.2s; }
.auth-switch a:hover { border-color: var(--red); color: var(--red); }

@media (max-width: 860px) {
  .auth-shell { grid-template-columns: 1fr; }
  .auth-left { display: none; }
  .auth-right { padding: 60px 28px; }
}
`;

const STRENGTH_COLORS = ["transparent", "#e63946", "#e8a000", "#2a9d3f"];
const STRENGTH_LABELS = ["", "Weak", "Fair", "Strong"];

export default function Register() {
  const navigate = useNavigate();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  const handleRegister = () => {
    if (!name || !email || !password) { alert("Fill all details"); return; }
    if (!email.includes("@")) { alert("Enter a valid email"); return; }
    if (password.length < 6) { alert("Password must be at least 6 characters"); return; }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === email)) { alert("Email already registered"); return; }
    setLoading(true);
    setTimeout(() => {
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful!");
      navigate("/login");
    }, 900);
  };

  return (
    <>
      <style>{css}</style>

      <div className="auth-shell">
        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-grid" />
          <div className="auth-left-bg-num">02</div>

          <div className="auth-logo">QUICK<em>RIDE</em></div>

          <div className="auth-left-body">
            <div className="auth-step-label">Create Account</div>
            <h1 className="auth-headline">
              Your next<em>great drive</em>starts here.
            </h1>
            <p className="auth-tagline">
              Join 50,000+ drivers who trust Quick-Ride for premium car rentals across India. Register in under a minute.
            </p>
          </div>

          <ul className="auth-perks">
            {["200+ premium vehicles available", "Instant booking confirmation", "Free cancellation up to 24h", "24/7 customer support included"].map(p => (
              <li className="auth-perk" key={p}>
                <div className="perk-check">✓</div>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-eyebrow">New Account</div>
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-sub">Start your journey in under a minute</p>

          <div className="field">
            <label>Full Name</label>
            <input type="text" placeholder="Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field">
            <label>Email Address</label>
            <input type="email" placeholder="rahul@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password" placeholder="Min. 6 characters"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            />
            {password && (
              <div style={{ marginTop: 8 }}>
                <div className="strength-bars">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="strength-bar" style={{ background: strength >= i ? STRENGTH_COLORS[strength] : "rgba(12,12,14,0.1)" }} />
                  ))}
                </div>
                <div className="strength-text" style={{ color: STRENGTH_COLORS[strength] }}>
                  {STRENGTH_LABELS[strength]} password
                </div>
              </div>
            )}
          </div>

          <button className="btn-auth" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in instead</Link>
          </div>
        </div>
      </div>
    </>
  );
}