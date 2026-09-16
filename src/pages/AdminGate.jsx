import React, { useState } from "react";
import OrderDashboard from "../Dashboard/DashboardShell";

// ── CHANGE THESE TWO VALUES BEFORE DEPLOYING ───────────────────────────────
const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "Survaya@2026"; // pick your own real password
// ────────────────────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        window.localStorage.setItem("sn_admin_authed", "true");
      } catch (err) {
        // private/incognito mode — login still works for this tab only
      }
      setError("");
      onSuccess();
    } else {
      setError("Wrong username or password.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#16311F" }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: "#fff", borderRadius: 12, padding: 32, width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 18, color: "#16311F", fontWeight: 600 }}>Survaya Naturals</div>
          <div style={{ fontSize: 12, color: "#8A8477" }}>Order Management — Admin Only</div>
        </div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoFocus
          style={{ border: "1px solid #EDE7DC", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ border: "1px solid #EDE7DC", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" }}
        />
        {error && <div style={{ fontSize: 12, color: "#C0492F" }}>{error}</div>}
        <button
          type="submit"
          style={{ background: "#16311F", color: "#fff", fontSize: 14, fontWeight: 500, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer" }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}

/**
 * This is now a normal page component — you route to it with React Router
 * (see the <Route path="/sn-orders-portal" element={<AdminGate />} />
 * added in App.jsx), so it no longer needs to check the URL itself.
 */
export default function AdminGate() {
  const [authed, setAuthed] = useState(() => {
    try {
      return window.localStorage.getItem("sn_admin_authed") === "true";
    } catch (err) {
      return false;
    }
  });

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div>
      <button
        onClick={() => {
          try {
            window.localStorage.removeItem("sn_admin_authed");
          } catch (err) {}
          setAuthed(false);
        }}
        style={{ position: "fixed", top: 12, right: 12, zIndex: 50, background: "#fff", border: "1px solid #EDE7DC", fontSize: 12, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}
        className="print:hidden"
      >
        Log Out
      </button>
      <OrderDashboard />
    </div>
  );
}