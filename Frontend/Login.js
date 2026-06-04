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
.auth-logo { font-family: var(--font-hero); font-size: 20px; letter-spacing: 3px; color: white; }
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
  color: white; letter-spacing: 2px; line-height: 0.9; margin-bottom: 28px;
}
.auth-headline em {
  font-family: var(--font-display); font-style: italic; color: var(--red);
  font-size: clamp(44px, 5vw, 68px); display: block;
}
.auth-tagline {
  font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.45);
  font-weight: 300; max-width: 380px;
}
.auth-stats { display: flex; gap: 32px; position: relative; z-index: 1; }
.auth-stat-num { font-family: var(--font-hero); font-size: 32px; color: white; letter-spacing: 1px; line-height: 1; }
.auth-stat-label { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 3px; }

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
.auth-form-sub { font-size: 13px; color: var(--muted); margin-bottom: 40px; font-weight: 300; }

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

.otp-row { display: flex; gap: 10px; }
.otp-row input { flex: 1; }
.btn-send-otp {
  background: var(--ink); color: white; border: none;
  padding: 14px 18px; font-family: var(--font-body); font-size: 12px;
  font-weight: 600; letter-spacing: 1px; cursor: pointer;
  transition: all 0.25s; white-space: nowrap;
}
.btn-send-otp:hover { background: var(--red); }
.btn-send-otp:disabled { opacity: 0.5; cursor: not-allowed; }

.pass-wrap { position: relative; }
.pass-wrap input { padding-right: 52px; }
.pass-toggle {
  position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  font-size: 15px; color: var(--muted); transition: color 0.2s; padding: 4px;
}
.pass-toggle:hover { color: var(--ink); }

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

.auth-divider { margin: 24px 0; display: flex; align-items: center; gap: 16px; }
.auth-divider::before, .auth-divider::after { content:''; flex:1; height:1px; background:rgba(12,12,14,0.1); }
.auth-divider span { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }

.auth-switch { text-align: center; font-size: 12.5px; color: var(--muted); font-weight: 300; }
.auth-switch a { color: var(--ink); font-weight: 600; text-decoration: none; border-bottom: 1px solid rgba(12,12,14,0.25); transition: all 0.2s; }
.auth-switch a:hover { border-color: var(--red); color: var(--red); }

.err-msg {
  background: rgba(230,57,70,0.08); border-left: 3px solid var(--red);
  padding: 10px 14px; font-size: 12px; color: var(--red); margin-bottom: 16px; font-weight: 500;
}
.success-msg {
  background: rgba(42,157,63,0.08); border-left: 3px solid var(--green);
  padding: 10px 14px; font-size: 12px; color: var(--green); margin-bottom: 16px; font-weight: 500;
}

.step-indicator {
  display: flex; gap: 8px; margin-bottom: 32px;
}
.step-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(12,12,14,0.15); transition: all 0.3s;
}
.step-dot.active { background: var(--red); width: 24px; border-radius: 4px; }

@media (max-width: 860px) {
  .auth-shell { grid-template-columns: 1fr; }
  .auth-left  { display: none; }
  .auth-right { padding: 60px 28px; }
}
`;

export default function Login() {
  const navigate = useNavigate();

  // Step 1 = enter email + password, Step 2 = enter OTP
  const [step, setStep] = useState(1);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [otp,      setOtp]      = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errMsg,   setErrMsg]   = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // STEP 1: Validate credentials then send OTP
  const handleSendOtp = async () => {
    setErrMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrMsg("Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user  = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setErrMsg("Invalid email or password");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrMsg(data.message || "Failed to send OTP");
        return;
      }

      setCurrentUser(user);
      setSuccessMsg(`OTP sent to ${email} — check your inbox!`);
      setStep(2);
    } catch (err) {
      setErrMsg("Cannot connect to server. Make sure backend is running.");
    } finally {
      setOtpLoading(false);
    }
  };

  // STEP 2: Verify OTP and login
  const handleVerifyOtp = async () => {
    setErrMsg("");
    setSuccessMsg("");

    if (!otp) {
      setErrMsg("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrMsg(data.message || "OTP verification failed");
        return;
      }

      // OTP verified — log the user in
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      navigate("/");
      window.location.reload();
    } catch (err) {
      setErrMsg("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="auth-shell">

        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-grid" />
          <div className="auth-left-bg-num">01</div>
          <div className="auth-logo">QUICK<em>RIDE</em></div>
          <div className="auth-left-body">
            <div className="auth-step-label">Member Login</div>
            <h1 className="auth-headline">Ready<em>to drive</em>again?</h1>
            <p className="auth-tagline">
              Sign in to access your bookings, manage your rentals, and get back on the road in seconds.
            </p>
          </div>
          <div className="auth-stats">
            {[{ num:"200+", lbl:"Vehicles" },{ num:"50K+", lbl:"Members" },{ num:"4.9★", lbl:"Rating" }].map(s => (
              <div key={s.lbl}>
                <div className="auth-stat-num">{s.num}</div>
                <div className="auth-stat-label">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-eyebrow">Sign In</div>

          {/* Step indicator dots */}
          <div className="step-indicator">
            <div className={`step-dot ${step === 1 ? "active" : ""}`} />
            <div className={`step-dot ${step === 2 ? "active" : ""}`} />
          </div>

          {step === 1 ? (
            <>
              <h2 className="auth-form-title">Welcome back</h2>
              <p className="auth-form-sub">Enter your credentials to receive an OTP</p>

              {errMsg     && <div className="err-msg">⚠ {errMsg}</div>}
              {successMsg && <div className="success-msg">✓ {successMsg}</div>}

              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                />
              </div>

              <div className="field">
                <label>Password</label>
                <div className="pass-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  />
                  <button className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button className="btn-auth" onClick={handleSendOtp} disabled={otpLoading}>
                {otpLoading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </>
          ) : (
            <>
              <h2 className="auth-form-title">Verify OTP</h2>
              <p className="auth-form-sub">Enter the 6-digit OTP sent to <b>{email}</b></p>

              {errMsg     && <div className="err-msg">⚠ {errMsg}</div>}
              {successMsg && <div className="success-msg">✓ {successMsg}</div>}

              <div className="field">
                <label>Enter OTP</label>
                <input
                  type="text"
                  placeholder="e.g. 482910"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  style={{ letterSpacing: "8px", fontSize: "20px", textAlign: "center" }}
                />
              </div>

              <button className="btn-auth" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login →"}
              </button>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={() => { setStep(1); setErrMsg(""); setSuccessMsg(""); setOtp(""); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--muted)", textDecoration: "underline" }}
                >
                  ← Go back & resend OTP
                </button>
              </div>
            </>
          )}

          <div className="auth-divider"><span>or</span></div>
          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one — it's free</Link>
          </div>
        </div>

      </div>
    </>
  );
}