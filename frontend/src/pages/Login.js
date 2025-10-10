import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (data.token) {
        // Save token for future authenticated requests
        localStorage.setItem("token", data.token);

        // Redirect based on user role
        const role = data.user?.role || "user";
        if (role === "admin") navigate("/admin");
        else navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <div style={styles.brandContainer}>
          <span style={styles.brandIcon}>📔</span>
          <h1 style={styles.brandName}>MindMitr</h1>
        </div>
        <p style={styles.brandTagline}>
          "Excellence is not an act, but a habit"
        </p>
        <p style={styles.brandDescription}>
          Track your daily habits, build powerful streaks, and achieve consistent growth with MindMitr.
        </p>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Welcome Back</h2>
          <p style={styles.formSubtitle}>Sign in to continue your journey</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#8B6F47";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139, 111, 71, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E8DCC8";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#8B6F47";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139, 111, 71, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E8DCC8";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              style={styles.submitButton}
              type="submit"
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = "#6B4423";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(107, 68, 35, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = "#8B6F47";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(107, 68, 35, 0.2)";
                }
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>OR</span>
            <span style={styles.dividerLine}></span>
          </div>

          <p style={styles.footerText}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={styles.link}
              onMouseEnter={(e) => {
                e.target.style.color = "#6B4423";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#8B6F47";
                e.target.style.textDecoration = "none";
              }}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: "#FFFEF9",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  leftSection: {
    flex: 1,
    background: "linear-gradient(135deg, #8B6F47 0%, #6B4423 100%)",
    padding: "80px 60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#FFFEF9"
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px"
  },
  brandIcon: {
    fontSize: "48px"
  },
  brandName: {
    fontSize: "42px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-1px"
  },
  brandTagline: {
    fontSize: "24px",
    fontStyle: "italic",
    marginBottom: "16px",
    color: "rgba(255, 254, 249, 0.9)",
    fontWeight: "400"
  },
  brandDescription: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "rgba(255, 254, 249, 0.85)",
    maxWidth: "500px"
  },
  rightSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px"
  },
  formCard: {
    background: "#FFFEF9",
    padding: "50px 40px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(139, 111, 71, 0.1)",
    border: "1px solid #E8DCC8",
    width: "100%",
    maxWidth: "450px"
  },
  formTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: "8px",
    textAlign: "center"
  },
  formSubtitle: {
    fontSize: "15px",
    color: "#6B5B4F",
    textAlign: "center",
    marginBottom: "32px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2C1810",
    marginBottom: "4px"
  },
  input: {
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #E8DCC8",
    borderRadius: "8px",
    background: "#FFFEF9",
    color: "#2C1810",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit"
  },
  submitButton: {
    marginTop: "8px",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "700",
    background: "#8B6F47",
    color: "#FFFEF9",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(107, 68, 35, 0.2)"
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "24px 0"
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#E8DCC8"
  },
  dividerText: {
    fontSize: "13px",
    color: "#8B7355",
    fontWeight: "600"
  },
  footerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6B5B4F",
    margin: 0
  },
  link: {
    color: "#8B6F47",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease"
  }
};

export default Login;