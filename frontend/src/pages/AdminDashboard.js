import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [overview, setOverview] = useState({});
  const [popular, setPopular] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorOverview, setErrorOverview] = useState(null);
  const [errorPopular, setErrorPopular] = useState(null);

  useEffect(() => {
    fetchOverview();
    fetchPopular();
  }, []);

  async function fetchOverview() {
    try {
      const data = await apiRequest("/api/admin/overview");
      setOverview(data || {});
    } catch (err) {
      console.error("Error fetching overview:", err);
      setErrorOverview("Failed to load overview.");
    } finally {
      setLoadingOverview(false);
    }
  }

  async function fetchPopular() {
    try {
      const data = await apiRequest("/api/admin/popular-habits");
      console.log("Popular data:", data);

      // Ensure popular is always an array
      if (Array.isArray(data)) {
        setPopular(data);
      } else if (data && Array.isArray(data.habits)) {
        setPopular(data.habits);
      } else {
        setPopular([]);
      }
    } catch (err) {
      console.error("Error fetching popular habits:", err);
      setErrorPopular("Failed to load popular habits.");
      setPopular([]);
    } finally {
      setLoadingPopular(false);
    }
  }

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Monitor platform activity and user engagement</p>
        </div>

        {/* Overview Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>📊</span>
            <h2 style={styles.sectionTitle}>Platform Overview</h2>
          </div>

          {loadingOverview ? (
            <div style={styles.loadingCard}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading overview...</p>
            </div>
          ) : errorOverview ? (
            <div style={styles.errorCard}>
              <span style={styles.errorIcon}>⚠️</span>
              <p style={styles.errorText}>{errorOverview}</p>
            </div>
          ) : (
            <div style={styles.overviewCard}>
              {Object.keys(overview).length > 0 ? (
                Object.entries(overview).map(([key, value], index) => (
                  <div 
                    key={index} 
                    style={styles.dataRow}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F5EFE6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 0 ? "#FFFEF9" : "#FDFBF7";
                    }}
                  >
                    <div style={styles.dataKey}>
                      <span style={styles.keyDot}>●</span>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </div>
                    <div style={styles.dataValue}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyData}>No overview data available</div>
              )}
            </div>
          )}
        </div>

        {/* Popular Habits Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🏆</span>
            <h2 style={styles.sectionTitle}>Most Popular Habits</h2>
          </div>

          {loadingPopular ? (
            <div style={styles.loadingCard}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading popular habits...</p>
            </div>
          ) : errorPopular ? (
            <div style={styles.errorCard}>
              <span style={styles.errorIcon}>⚠️</span>
              <p style={styles.errorText}>{errorPopular}</p>
            </div>
          ) : popular.length > 0 ? (
            <div style={styles.habitsList}>
              {popular.map((h, i) => (
                <div 
                  key={i} 
                  style={styles.habitCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(8px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(139, 111, 71, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(139, 111, 71, 0.08)";
                  }}
                >
                  <div style={styles.habitRank}>{i + 1}</div>
                  <div style={styles.habitInfo}>
                    <div style={styles.habitTitle}>{h.title || h.name || "Untitled Habit"}</div>
                    {h.count && <div style={styles.habitCount}>{h.count} users</div>}
                  </div>
                  <div style={styles.habitBadge}>Popular</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyCard}>
              <span style={styles.emptyIcon}>📭</span>
              <p style={styles.emptyText}>No popular habits found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#FFFEF9",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 40px 80px"
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
    paddingTop: "20px"
  },
  title: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#2C1810",
    marginBottom: "12px",
    letterSpacing: "-1px"
  },
  subtitle: {
    fontSize: "16px",
    color: "#6B5B4F",
    fontWeight: "400"
  },
  section: {
    marginBottom: "50px"
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px"
  },
  sectionIcon: {
    fontSize: "28px"
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2C1810",
    margin: 0
  },
  overviewCard: {
    background: "#FFFEF9",
    borderRadius: "16px",
    border: "1px solid #E8DCC8",
    boxShadow: "0 4px 12px rgba(139, 111, 71, 0.08)",
    overflow: "hidden"
  },
  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    borderBottom: "1px solid #F5EFE6",
    transition: "all 0.2s ease"
  },
  dataKey: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#2C1810",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textTransform: "capitalize"
  },
  keyDot: {
    color: "#8B6F47",
    fontSize: "20px"
  },
  dataValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#8B6F47",
    background: "#F5EFE6",
    padding: "8px 20px",
    borderRadius: "8px",
    minWidth: "80px",
    textAlign: "center"
  },
  emptyData: {
    padding: "40px",
    textAlign: "center",
    color: "#6B5B4F",
    fontSize: "15px"
  },
  habitsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  habitCard: {
    background: "#FFFEF9",
    padding: "20px 24px",
    borderRadius: "12px",
    border: "1px solid #E8DCC8",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(139, 111, 71, 0.08)"
  },
  habitRank: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #8B6F47 0%, #6B4423 100%)",
    color: "#FFFEF9",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700"
  },
  habitInfo: {
    flex: 1
  },
  habitTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2C1810",
    marginBottom: "4px"
  },
  habitCount: {
    fontSize: "13px",
    color: "#8B6F47",
    fontWeight: "500"
  },
  habitBadge: {
    background: "#F5EFE6",
    color: "#8B6F47",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  loadingCard: {
    background: "#FFFEF9",
    padding: "60px 40px",
    borderRadius: "16px",
    border: "1px solid #E8DCC8",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(139, 111, 71, 0.08)"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #E8DCC8",
    borderTop: "4px solid #8B6F47",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px"
  },
  loadingText: {
    fontSize: "15px",
    color: "#6B5B4F",
    margin: 0
  },
  errorCard: {
    background: "#FFF5F5",
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid #FFCCCC",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(255, 0, 0, 0.08)"
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "12px",
    display: "block"
  },
  errorText: {
    fontSize: "15px",
    color: "#CC0000",
    margin: 0,
    fontWeight: "500"
  },
  emptyCard: {
    background: "#FFFEF9",
    padding: "60px 40px",
    borderRadius: "16px",
    border: "1px solid #E8DCC8",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(139, 111, 71, 0.08)"
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
    display: "block"
  },
  emptyText: {
    fontSize: "15px",
    color: "#6B5B4F",
    margin: 0
  }
};

// Add spinner animation in a style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;