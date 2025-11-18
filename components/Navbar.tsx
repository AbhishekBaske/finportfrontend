import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <style>
        {`
          .nav-link:hover {
            color: #4f46e5 !important;
            background: rgba(79,70,229,0.1) !important;
            transform: translateY(-2px);
          }

          .glow-btn:hover {
            transform: translateY(-2px);
            background-color: #4338ca !important;
          }

          .logout-btn:hover {
            background:#ff6b6b !important;
            color:white !important;
            transform:translateY(-2px);
          }

          @media (max-width: 768px) {
            .desktop-nav { display:none !important; }
            .mobile-toggle { display:block !important; }
          }
          @media (min-width: 769px) {
            .desktop-nav { display:flex !important; }
            .mobile-menu { display:none !important; }
          }
        `}
      </style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          padding: "16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LOGO */}
          <a
            href="/"
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              background: "linear-gradient(135deg,#4f46e5,#818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-1px",
              textDecoration: "none",
            }}
          >
            📈 Finport
          </a>

          {/* DESKTOP MENU */}
          <div
            className="desktop-nav"
            style={{ display: "flex", gap: "24px", alignItems: "center" }}
          >
            <a href="/" className="nav-link" style={linkStyle}>
              Home
            </a>

            {isAuthenticated && (
              <a href="/dashboard" className="nav-link" style={linkStyle}>
                Dashboard
              </a>
            )}

            {isAuthenticated ? (
              <>
                <span style={welcomeStyle}>Welcome, {user?.name}</span>

                <button
                  className="logout-btn"
                  style={logoutBtn}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/signin" className="nav-link" style={linkStyle}>
                  Sign In
                </a>

                <a href="/signup">
                  <button className="glow-btn" style={ctaButton}>
                    Get Started
                  </button>
                </a>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="mobile-toggle"
            style={{
              display: "none",
              background: "none",
              border: "none",
              fontSize: "1.8rem",
              cursor: "pointer",
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div
            className="mobile-menu"
            style={{
              padding: "20px",
              borderTop: "1px solid #eee",
              background: "white",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <a href="/" className="nav-link" style={linkStyle}>
                Home
              </a>

              {isAuthenticated && (
                <a href="/dashboard" className="nav-link" style={linkStyle}>
                  Dashboard
                </a>
              )}

              {isAuthenticated ? (
                <>
                  <span style={welcomeStyle}>Welcome, {user?.name}</span>
                  <button
                    className="logout-btn"
                    style={logoutBtn}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/signin" className="nav-link" style={linkStyle}>
                    Sign In
                  </a>

                  <a href="/signup">
                    <button className="glow-btn" style={ctaButton}>
                      Get Started
                    </button>
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

/* ────────────────────────────────── */
/* SHARED STYLE OBJECTS (MATCH HOME) */
/* ────────────────────────────────── */

const linkStyle: React.CSSProperties = {
  color: "#4b5563",
  fontWeight: 500,
  textDecoration: "none",
  padding: "8px 14px",
  transition: "0.2s",
  borderRadius: "8px",
  fontSize: "0.95rem",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#4f46e5",
  color: "white",
  borderRadius: "12px",
  border: "none",
  padding: "10px 22px",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.3s",
};

const logoutBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #ff6b6b",
  color: "#ff6b6b",
  borderRadius: "8px",
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "0.3s",
};

const welcomeStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#4f46e5",
  fontWeight: 600,
};

export default Navbar;
