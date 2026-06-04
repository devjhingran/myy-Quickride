import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════
   CONFIG — edit only these lines
   ══════════════════════════════════════════════ */
const RAZORPAY_KEY_ID = "rzp_test_SWCV9Wn1omqc73";
const MY_UPI_ID       = "lakshayyadav1422@okaxis";
const MERCHANT_NAME   = "QuickRide Rentals";
const MY_QR_URL       = "https://i.imgur.com/iZLBDF5.jpeg";
/* ══════════════════════════════════════════════ */

/* ─────────── CSS ─────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');

:root {
  --bg:        #09090f;
  --surface:   #0f0f1a;
  --card:      #141422;
  --border:    rgba(255,255,255,0.07);
  --accent:    #7c6cfc;
  --accent2:   #b49cff;
  --red:       #ff4d6d;
  --green:     #00e5a0;
  --text:      #f0eeff;
  --muted:     rgba(240,238,255,0.4);
  --faint:     rgba(240,238,255,0.08);
  --font-ui:   'Syne', sans-serif;
  --font-body: 'Crimson Pro', serif;
  --font-mono: 'Space Mono', monospace;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--text); font-family:var(--font-ui); min-height:100vh; overflow-x:hidden; }

.pay-page {
  min-height:100vh; display:grid; grid-template-columns:1.1fr 1fr; position:relative;
}
.pay-page::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(124,108,252,0.04) 60px),
    repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(124,108,252,0.04) 60px);
}

.left {
  position:relative; padding:56px 52px;
  display:flex; flex-direction:column; gap:40px;
  border-right:1px solid var(--border); z-index:1;
}
.brand { display:flex; align-items:center; gap:14px; }
.brand-icon {
  width:40px; height:40px; background:var(--accent);
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  display:flex; align-items:center; justify-content:center; font-size:16px;
}
.brand-name { font-size:15px; font-weight:800; letter-spacing:4px; text-transform:uppercase; }
.brand-name span { color:var(--accent2); }
.checkout-label {
  font-size:9px; font-weight:700; letter-spacing:4px; text-transform:uppercase;
  color:var(--accent); display:flex; align-items:center; gap:10px;
}
.checkout-label::before { content:''; width:28px; height:1px; background:var(--accent); display:inline-block; }
.pay-headline { font-family:var(--font-body); font-size:clamp(36px,4.5vw,60px); font-weight:300; line-height:1.1; }
.pay-headline em {
  font-style:italic;
  background:linear-gradient(135deg,var(--accent2),var(--accent));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}

.car-card { background:var(--card); border:1px solid var(--border); overflow:hidden; position:relative; }
.car-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--accent),var(--accent2),transparent); }
.car-img-wrap { width:100%; height:220px; overflow:hidden; background:#0b0b16; }
.car-img-wrap img { width:100%; height:100%; object-fit:cover; filter:brightness(0.85) saturate(1.1); transition:transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
.car-card:hover .car-img-wrap img { transform:scale(1.06); }
.car-img-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px; color:rgba(255,255,255,0.15); font-family:var(--font-mono); font-size:11px; letter-spacing:2px; }
.car-meta { padding:18px 22px; display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border); }
.car-name { font-size:17px; font-weight:700; }
.car-sub  { font-size:10px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; margin-top:3px; }
.car-price-tag { font-family:var(--font-mono); font-size:18px; color:var(--accent2); text-align:right; }
.car-price-tag small { font-size:10px; color:var(--muted); display:block; }

.summary-box { background:var(--card); border:1px solid var(--border); padding:24px; }
.summary-head { font-size:9px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--muted); margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid var(--border); }
.summary-row { display:flex; justify-content:space-between; align-items:center; padding:9px 0; font-size:13px; }
.summary-row + .summary-row { border-top:1px solid var(--faint); }
.s-key { color:var(--muted); }
.s-val { color:var(--text); font-weight:600; font-size:12px; text-align:right; max-width:55%; }
.total-strip { margin-top:18px; padding:18px 20px; background:linear-gradient(135deg,rgba(124,108,252,0.12),rgba(180,156,255,0.06)); border:1px solid rgba(124,108,252,0.25); display:flex; align-items:center; justify-content:space-between; }
.total-label  { font-size:9px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--accent2); }
.total-amount { font-family:var(--font-mono); font-size:32px; color:var(--text); }
.secure-row { display:flex; align-items:center; gap:8px; font-size:10px; color:var(--muted); }
.secure-dot { width:6px; height:6px; background:var(--green); border-radius:50%; flex-shrink:0; box-shadow:0 0 8px var(--green); animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

.right { padding:56px 52px; display:flex; flex-direction:column; z-index:1; background:var(--surface); }
.form-title { font-family:var(--font-body); font-size:28px; font-weight:300; font-style:italic; margin-bottom:4px; }
.form-sub   { font-size:12px; color:var(--muted); margin-bottom:32px; }

.tabs { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:32px; }
.tab { padding:14px 10px; background:var(--faint); border:1px solid var(--border); color:var(--muted); font-family:var(--font-ui); font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
.tab.active { background:rgba(124,108,252,0.15); border-color:var(--accent); color:var(--accent2); }
.tab:not(.active):hover { border-color:rgba(255,255,255,0.15); color:var(--text); }

.upi-section { animation:fadeUp 0.3s ease; }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

.qr-container { display:flex; flex-direction:column; align-items:center; margin-bottom:24px; }
.qr-frame {
  position:relative; width:240px; height:240px;
  background:white; padding:16px;
  display:flex; align-items:center; justify-content:center;
}
.qr-frame::before,.qr-frame::after { content:''; position:absolute; width:24px; height:24px; border-color:var(--accent); border-style:solid; }
.qr-frame::before { top:-3px; left:-3px; border-width:3px 0 0 3px; }
.qr-frame::after  { bottom:-3px; right:-3px; border-width:0 3px 3px 0; }
.qr-corner-tr { position:absolute; top:-3px; right:-3px; width:24px; height:24px; border-top:3px solid var(--accent); border-right:3px solid var(--accent); }
.qr-corner-bl { position:absolute; bottom:-3px; left:-3px; width:24px; height:24px; border-bottom:3px solid var(--accent); border-left:3px solid var(--accent); }
.qr-frame img { width:100%; height:100%; object-fit:contain; display:block; }

.qr-badge { background:var(--card); border:1px solid var(--border); border-top:none; width:240px; padding:14px 18px; text-align:center; }
.qr-upi-id    { font-family:var(--font-mono); font-size:12px; color:var(--accent2); letter-spacing:1px; }
.qr-scan-hint { font-size:10px; color:var(--muted); margin-top:4px; }

.upi-apps { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-bottom:20px; }
.upi-app  { padding:7px 14px; background:var(--faint); border:1px solid var(--border); font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); }

.upi-manual-label { font-size:9px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--muted); margin-bottom:12px; text-align:center; }
.upi-id-box { display:flex; align-items:center; border:1px solid var(--border); overflow:hidden; margin-bottom:12px; }
.upi-id-display { flex:1; padding:13px 16px; font-family:var(--font-mono); font-size:13px; color:var(--text); background:var(--card); }
.upi-copy-btn { padding:13px 18px; background:var(--faint); border:none; border-left:1px solid var(--border); color:var(--accent2); font-family:var(--font-ui); font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
.upi-copy-btn:hover  { background:rgba(124,108,252,0.15); }
.upi-copy-btn.copied { background:rgba(0,229,160,0.1); color:var(--green); }
.upi-notice { background:rgba(124,108,252,0.08); border:1px solid rgba(124,108,252,0.2); padding:14px 16px; font-size:11px; color:var(--muted); line-height:1.7; text-align:center; }
.upi-notice strong { color:var(--accent2); font-weight:600; }

/* Error banner */
.error-banner { background:rgba(255,77,109,0.1); border:1px solid rgba(255,77,109,0.3); padding:12px 16px; font-size:12px; color:#ff4d6d; line-height:1.6; margin-bottom:16px; display:flex; align-items:flex-start; gap:10px; }
.error-banner svg { flex-shrink:0; margin-top:1px; }

.card-section { animation:fadeUp 0.3s ease; }
.field { margin-bottom:18px; }
.field label { display:block; font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
.field input,.field select { width:100%; background:var(--card); border:1px solid var(--border); border-bottom:2px solid var(--border); padding:13px 16px; color:var(--text); font-family:var(--font-ui); font-size:14px; outline:none; transition:all 0.2s; appearance:none; border-radius:2px; }
.field input::placeholder { color:rgba(240,238,255,0.2); }
.field input:focus,.field select:focus { border-color:rgba(124,108,252,0.4); border-bottom-color:var(--accent); background:rgba(124,108,252,0.05); }
.field select { background:var(--card); cursor:pointer; }
.field select option { background:#141422; }
.grid-3 { display:grid; grid-template-columns:2fr 1fr 1fr; gap:12px; }
.card-num-wrap { position:relative; }
.card-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); font-size:18px; }

.btn-pay {
  width:100%; margin-top:24px;
  background:linear-gradient(135deg,var(--accent),#5046cc);
  color:white; border:none; padding:17px 32px;
  font-family:var(--font-ui); font-size:13px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
  cursor:pointer; transition:all 0.25s; position:relative; overflow:hidden;
  clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));
}
.btn-pay::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent); opacity:0; transition:opacity 0.2s; }
.btn-pay:hover::before { opacity:1; }
.btn-pay:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(124,108,252,0.4); }
.btn-pay:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
.pay-footer { margin-top:20px; padding-top:20px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:center; gap:8px; font-size:10px; color:var(--muted); }

.overlay { position:fixed; inset:0; background:rgba(9,9,15,0.96); display:flex; align-items:center; justify-content:center; z-index:999999; padding:20px; animation:ovIn 0.2s ease; }
@keyframes ovIn { from{opacity:0} to{opacity:1} }
.modal { background:var(--card); border:1px solid var(--border); width:100%; max-width:460px; overflow:hidden; animation:modIn 0.35s cubic-bezier(0.175,0.885,0.32,1.2); position:relative; }
@keyframes modIn { from{opacity:0;transform:scale(0.9) translateY(30px)} to{opacity:1;transform:scale(1) translateY(0)} }
.modal::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent); }
.modal-head { padding:24px 32px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
.modal-head-title { font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--muted); }
.modal-body { padding:40px 32px; text-align:center; }
.spinner { width:48px; height:48px; margin:0 auto 20px; border:2px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.7s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }
.processing-txt { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--muted); }
.success-ring { width:80px; height:80px; margin:0 auto 24px; border-radius:50%; background:conic-gradient(var(--green) 0deg,rgba(0,229,160,0.1) 0deg); display:flex; align-items:center; justify-content:center; animation:ringFill 0.8s ease forwards; }
@keyframes ringFill { to{background:conic-gradient(var(--green) 360deg,transparent 360deg)} }
.success-check { width:48px; height:48px; background:var(--bg); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; animation:checkPop 0.4s 0.3s cubic-bezier(0.175,0.885,0.32,1.275) both; }
@keyframes checkPop { from{transform:scale(0)} to{transform:scale(1)} }
.success-title { font-family:var(--font-body); font-size:36px; font-weight:300; font-style:italic; color:var(--text); margin-bottom:10px; }
.success-sub   { font-size:13px; color:var(--muted); line-height:1.8; margin-bottom:32px; }
.bid-chip { display:inline-block; padding:6px 16px; background:var(--faint); border:1px solid var(--border); font-family:var(--font-mono); font-size:11px; color:var(--accent2); letter-spacing:2px; margin-bottom:28px; }
.btn-home { width:100%; background:var(--green); color:#09090f; border:none; padding:16px; font-family:var(--font-ui); font-size:12px; font-weight:800; letter-spacing:3px; text-transform:uppercase; cursor:pointer; transition:all 0.25s; clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px)); }
.btn-home:hover { background:white; transform:translateY(-2px); }

.upi-confirm-body { padding:28px 32px; text-align:center; }
.upi-amount-badge { background:rgba(124,108,252,0.1); border:1px solid rgba(124,108,252,0.25); display:inline-block; padding:10px 28px; margin-bottom:24px; }
.upi-amount-badge span { display:block; font-size:9px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--accent); margin-bottom:4px; }
.upi-amount-badge strong { font-family:var(--font-mono); font-size:34px; color:var(--text); }
.modal-qr-wrap { width:200px; height:200px; background:white; padding:14px; margin:0 auto 20px; position:relative; display:flex; align-items:center; justify-content:center; }
.modal-qr-wrap img { width:100%; height:100%; object-fit:contain; display:block; }
.modal-qr-wrap::before,.modal-qr-wrap::after { content:''; position:absolute; width:20px; height:20px; border-color:var(--accent); border-style:solid; }
.modal-qr-wrap::before { top:-2px; left:-2px; border-width:2px 0 0 2px; }
.modal-qr-wrap::after  { bottom:-2px; right:-2px; border-width:0 2px 2px 0; }
.confirm-instruction { font-size:12px; color:var(--muted); line-height:1.8; margin-bottom:20px; }
.confirm-instruction strong { color:var(--text); font-weight:600; }
.modal-upi-box { display:flex; align-items:center; border:1px solid var(--border); overflow:hidden; margin-bottom:20px; }
.modal-upi-display { flex:1; padding:11px 14px; font-family:var(--font-mono); font-size:12px; color:var(--text); background:var(--card); }
.modal-copy-btn { padding:11px 16px; background:var(--faint); border:none; border-left:1px solid var(--border); color:var(--accent2); font-family:var(--font-ui); font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
.modal-copy-btn:hover  { background:rgba(124,108,252,0.15); }
.modal-copy-btn.copied { background:rgba(0,229,160,0.1); color:var(--green); }
.btn-i-paid { width:100%; background:linear-gradient(135deg,var(--accent),#5046cc); color:white; border:none; padding:16px; font-family:var(--font-ui); font-size:12px; font-weight:800; letter-spacing:3px; text-transform:uppercase; cursor:pointer; transition:all 0.25s; clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px)); }
.btn-i-paid:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(124,108,252,0.4); }
.btn-i-paid:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
.btn-cancel { width:100%; margin-top:10px; padding:12px; background:transparent; border:1px solid var(--border); color:var(--muted); font-family:var(--font-ui); font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; }
.btn-cancel:hover { border-color:var(--red); color:var(--red); }

@media (max-width:900px) {
  .pay-page { grid-template-columns:1fr; }
  .left,.right { padding:36px 24px; }
  .car-img-wrap { height:180px; }
}
`;

/* ── HELPERS ── */
function CarImg({ src, alt }) {
  const [err, setErr] = useState(false);
  if (!src || err) return (
    <div className="car-img-fallback">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <rect x="1" y="8" width="22" height="10" rx="2"/>
        <path d="M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/>
        <circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/>
      </svg>
      <span>{alt || "VEHICLE"}</span>
    </div>
  );
  return <img src={src} alt={alt} onError={() => setErr(true)} />;
}

/* ── Load Razorpay script with retry ── */
function loadRazorpay() {
  return new Promise((resolve) => {
    // Already loaded
    if (window.Razorpay) { resolve(true); return; }

    // Script already injected but not yet ready — wait for it
    const existing = document.querySelector('script[src*="razorpay"]');
    if (existing) {
      existing.addEventListener("load",  () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function generateBookingId(method) {
  const prefix = method === "UPI" ? "QR" : "CD";
  return prefix + Date.now().toString(36).toUpperCase();
}

function saveBooking(car, booking, method, paymentId) {
  const data = {
    carName:    car?.name,
    carImage:   car?.image,
    name:       booking?.name,
    email:      booking?.email,
    address:    booking?.address,
    pickup:     booking?.pickup,
    returnDate: booking?.returnDate,
    days:       booking?.days,
    price:      booking?.price,
    paidAt:     new Date().toLocaleString("en-IN"),
    bookingId:  paymentId,
    method,
  };
  try {
    const all = JSON.parse(localStorage.getItem("bookings") || "[]");
    all.push(data);
    localStorage.setItem("bookings", JSON.stringify(all));
  } catch(e) {
    console.warn("Could not save booking to localStorage:", e);
  }
}

/* ── SUCCESS MODAL ── */
function SuccessModal({ bookingId, method, onGoHome }) {
  return ReactDOM.createPortal(
    <div className="overlay">
      <div className="modal">
        <div className="modal-head">
          <div className="modal-head-title">Booking Confirmed</div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(240,238,255,0.3)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="modal-body">
          <div className="success-ring"><div className="success-check">✓</div></div>
          <div className="success-title">Payment Done!</div>
          <div className="success-sub">
            {method === "UPI"
              ? "UPI payment received. Your car is reserved!"
              : "Card payment successful. Your car is reserved!"}
          </div>
          <div className="bid-chip">#{bookingId}</div>
          <button className="btn-home" onClick={onGoHome}>Go to Dashboard →</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── UPI MODAL ── */
function UpiModal({ amount, amountRaw, car, booking, onClose, onSuccess }) {
  const [stage,    setStage]   = useState("qr");   // "qr" | "loading" | "done"
  const [copied,   setCopied]  = useState(false);
  const [error,    setError]   = useState("");
  const [bookingId, setBookingId] = useState("");

  const copy = useCallback(() => {
    navigator.clipboard.writeText(MY_UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for browsers that block clipboard
      const el = document.createElement("textarea");
      el.value = MY_UPI_ID;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleIPaid = async () => {
    setError("");
    setStage("loading");

    const loaded = await loadRazorpay();
    if (!loaded) {
      setError("Payment gateway could not be loaded. Please check your internet connection and try again.");
      setStage("qr");
      return;
    }

    if (!window.Razorpay) {
      setError("Razorpay is unavailable in this environment. Please try on a different browser.");
      setStage("qr");
      return;
    }

    const options = {
      key:          RAZORPAY_KEY_ID,
      amount:       amountRaw * 100,
      currency:     "INR",
      name:         MERCHANT_NAME,
      description:  `Car Rental — ${car?.name || "Vehicle"}`,
      image:        car?.image || "",
      prefill: {
        name:    booking?.name  || "",
        email:   booking?.email || "",
        contact: booking?.phone || "",
        method:  "upi",
        vpa:     MY_UPI_ID,
      },
      notes: {
        pickup:     booking?.pickup     || "",
        returnDate: booking?.returnDate || "",
        days:       String(booking?.days || ""),
      },
      theme:  { color: "#7c6cfc" },
      modal:  { backdropclose: false, escape: false, animation: true },
      handler: function (response) {
        const pid = response.razorpay_payment_id || generateBookingId("UPI");
        saveBooking(car, booking, "UPI", pid);
        setBookingId(pid);
        setStage("done");
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        const msg = resp?.error?.description || "Payment failed. Please try again.";
        setError(msg);
        setStage("qr");
      });
      // Keep modal visible beneath Razorpay overlay
      setStage("qr");
      rzp.open();
    } catch (err) {
      setError("Failed to open payment gateway: " + err.message);
      setStage("qr");
    }
  };

  if (stage === "done") {
    return <SuccessModal bookingId={bookingId} method="UPI" onGoHome={onSuccess} />;
  }

  return ReactDOM.createPortal(
    <div className="overlay" onClick={e => { if (stage === "qr" && e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-head-title">
            {stage === "loading" ? "Opening Payment Gateway…" : "Scan & Pay via UPI"}
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(240,238,255,0.3)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        {stage === "loading" ? (
          <div className="modal-body">
            <div className="spinner"/>
            <div className="processing-txt">Loading secure gateway…</div>
          </div>
        ) : (
          <div className="upi-confirm-body">
            <div className="upi-amount-badge">
              <span>Total Due</span>
              <strong>₹{amount}</strong>
            </div>

            <div className="modal-qr-wrap">
              <img src={MY_QR_URL} alt="UPI QR — Scan to Pay" />
            </div>

            <p className="confirm-instruction">
              Open <strong>GPay / PhonePe / Paytm / BHIM</strong> → Scan QR<br/>
              or manually enter UPI ID below
            </p>

            <div className="modal-upi-box">
              <div className="modal-upi-display">{MY_UPI_ID}</div>
              <button className={`modal-copy-btn${copied ? " copied" : ""}`} onClick={copy}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            {error && (
              <div className="error-banner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button className="btn-i-paid" onClick={handleIPaid} disabled={stage === "loading"}>
              ✓ I've Paid · Confirm Booking
            </button>
            <button className="btn-cancel" onClick={onClose}>Cancel</button>

            <p style={{fontSize:10,color:"var(--muted)",marginTop:16,lineHeight:1.7}}>
              {MERCHANT_NAME} · Razorpay will verify your payment
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ── CARD PAYMENT — launches Razorpay checkout ── */
function openRazorpayCard({ amountRaw, car, booking, onSuccess, onFail }) {
  if (!window.Razorpay) {
    onFail("Razorpay is not available. Please refresh the page and try again.");
    return;
  }

  const options = {
    key:         RAZORPAY_KEY_ID,
    amount:      amountRaw * 100,
    currency:    "INR",
    name:        MERCHANT_NAME,
    description: `Car Rental — ${car?.name || "Vehicle"}`,
    image:       car?.image || "",
    prefill: {
      name:    booking?.name  || "",
      email:   booking?.email || "",
      contact: booking?.phone || "",
    },
    notes: {
      pickup:     booking?.pickup     || "",
      returnDate: booking?.returnDate || "",
      days:       String(booking?.days || ""),
    },
    theme:  { color: "#7c6cfc" },
    modal:  { backdropclose: false, escape: false, animation: true },
    handler: function (response) {
      const pid = response.razorpay_payment_id || generateBookingId("CARD");
      saveBooking(car, booking, "CARD", pid);
      onSuccess(pid);
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (resp) {
      onFail(resp?.error?.description || "Payment failed. Please try again.");
    });
    rzp.open();
  } catch (err) {
    onFail("Could not open payment gateway: " + err.message);
  }
}

/* ── MAIN ── */
export default function Payment() {
  const location = useLocation();
  const navigate  = useNavigate();
  const car     = location.state?.car;
  const booking = location.state?.booking;

  const [method,        setMethod]        = useState("UPI");
  const [modal,         setModal]         = useState(null);   // null | "upi" | "success"
  const [successId,     setSuccessId]     = useState("");
  const [successMethod, setSuccessMethod] = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [copied,        setCopied]        = useState(false);
  const [rzpReady,      setRzpReady]      = useState(false);

  // Preload Razorpay on mount — set ready flag
  useEffect(() => {
    loadRazorpay().then((ok) => {
      setRzpReady(ok);
      if (!ok) {
        setError("Payment gateway could not be preloaded. Ensure you have an internet connection.");
      }
    });
  }, []);

  const amountRaw   = booking?.price ?? 0;
  const totalAmount = amountRaw.toLocaleString("en-IN");

  const copyUpi = useCallback(() => {
    navigator.clipboard.writeText(MY_UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement("textarea");
      el.value = MY_UPI_ID;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleProceed = async () => {
    setError("");

    if (method === "UPI") {
      setModal("upi");
      return;
    }

    /* CARD — ensure Razorpay is ready */
    setLoading(true);
    const loaded = await loadRazorpay();
    setLoading(false);

    if (!loaded || !window.Razorpay) {
      setError("Payment gateway failed to load. Please check your internet connection and try again.");
      return;
    }

    openRazorpayCard({
      amountRaw,
      car,
      booking,
      onSuccess: (pid) => {
        setSuccessId(pid);
        setSuccessMethod("CARD");
        setModal("success");
      },
      onFail: (msg) => setError(msg),
    });
  };

  return (
    <>
      <style>{css}</style>
      <div className="pay-page">

        {/* LEFT */}
        <div className="left">
          <div className="brand">
            <div className="brand-icon">🚗</div>
            <div className="brand-name">QUICK<span>RIDE</span></div>
          </div>
          <div>
            <div className="checkout-label">Secure Checkout</div>
            <h1 className="pay-headline">Complete<br/>Your <em>Booking</em></h1>
          </div>
          {car && (
            <div className="car-card">
              <div className="car-img-wrap"><CarImg src={car.image} alt={car.name}/></div>
              <div className="car-meta">
                <div>
                  <div className="car-name">{car.name}</div>
                  <div className="car-sub">Selected Vehicle</div>
                </div>
                <div className="car-price-tag">
                  ₹{car.price?.toLocaleString("en-IN")}
                  <small>per day</small>
                </div>
              </div>
            </div>
          )}
          {booking && (
            <div className="summary-box">
              <div className="summary-head">Booking Summary</div>
              {[
                ["Guest",    booking.name],
                ["Pickup",   booking.pickup],
                ["Return",   booking.returnDate],
                ["Duration", `${booking.days} day${booking.days > 1 ? "s" : ""}`],
                ["Address",  booking.address],
              ].map(([k, v]) => v ? (
                <div className="summary-row" key={k}>
                  <span className="s-key">{k}</span>
                  <span className="s-val">{v}</span>
                </div>
              ) : null)}
              <div className="total-strip">
                <span className="total-label">Total Due</span>
                <span className="total-amount">₹{totalAmount}</span>
              </div>
            </div>
          )}
          <div className="secure-row">
            <div className="secure-dot"/>
            256-bit SSL · PCI DSS Compliant · Razorpay Secure
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="form-title">Payment Details</div>
          <p className="form-sub">Choose your preferred method to confirm your booking</p>

          <div className="tabs">
            <button className={`tab${method === "UPI" ? " active" : ""}`}  onClick={() => { setMethod("UPI");  setError(""); }}>📱 UPI / QR Code</button>
            <button className={`tab${method === "CARD" ? " active" : ""}`} onClick={() => { setMethod("CARD"); setError(""); }}>💳 Debit / Credit Card</button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="error-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* UPI TAB */}
          {method === "UPI" && (
            <div className="upi-section">
              <div className="qr-container">
                <div className="qr-frame">
                  <div className="qr-corner-tr"/><div className="qr-corner-bl"/>
                  <img
                    src={MY_QR_URL}
                    alt="UPI QR — Scan to Pay"
                    style={{width:"100%",height:"100%",objectFit:"contain",display:"block"}}
                  />
                </div>
                <div className="qr-badge">
                  <div className="qr-upi-id">{MY_UPI_ID}</div>
                  <div className="qr-scan-hint">Scan with any UPI app · money goes to merchant</div>
                </div>
              </div>

              <div className="upi-apps">
                {["GPay","PhonePe","Paytm","BHIM","Amazon Pay"].map(a => (
                  <div key={a} className="upi-app">{a}</div>
                ))}
              </div>

              <div className="upi-manual-label">Or pay manually to UPI ID</div>
              <div className="upi-id-box">
                <div className="upi-id-display">{MY_UPI_ID}</div>
                <button className={`upi-copy-btn${copied ? " copied" : ""}`} onClick={copyUpi}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>

              <div className="upi-notice">
                Pay <strong>₹{totalAmount}</strong> to complete your booking.<br/>
                Click <strong>Proceed to Pay</strong> → Razorpay will confirm your payment.
              </div>
            </div>
          )}

          {/* CARD TAB */}
          {method === "CARD" && (
            <div className="card-section">
              <div className="upi-notice" style={{marginBottom:24}}>
                Click <strong>Pay ₹{totalAmount}</strong> below.<br/>
                Razorpay's secure checkout will open to process your card.
              </div>
            </div>
          )}

          <button
            className="btn-pay"
            onClick={handleProceed}
            disabled={loading}
          >
            {loading
              ? "Loading Gateway…"
              : method === "UPI"
                ? `Proceed to Pay ₹${totalAmount}`
                : `Pay ₹${totalAmount} via Razorpay →`}
          </button>

          <div className="pay-footer">
            🔒 &nbsp; Powered by Razorpay · 256-bit SSL · PCI DSS Compliant
          </div>
        </div>
      </div>

      {/* UPI Modal */}
      {modal === "upi" && (
        <UpiModal
          amount={totalAmount}
          amountRaw={amountRaw}
          car={car}
          booking={booking}
          onClose={() => setModal(null)}
          onSuccess={() => navigate("/")}
        />
      )}

      {/* Success Modal (card payments) */}
      {modal === "success" && (
        <SuccessModal
          bookingId={successId}
          method={successMethod}
          onGoHome={() => navigate("/")}
        />
      )}
    </>
  );
}