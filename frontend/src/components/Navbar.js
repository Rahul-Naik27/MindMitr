import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    if (!token) return null;

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <div style={styles.leftSection}>
                    <div 
                        style={styles.brand}
                        onClick={() => navigate("/dashboard")}
                    >
                        <span style={styles.brandIcon}>📔</span>
                        <span style={styles.brandText}>MindMitr</span>
                    </div>
                </div>

                <div style={styles.rightSection}>
                    <button
                        onClick={logout}
                        style={styles.logoutButton}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#C54A4A";
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 4px 12px rgba(197, 74, 74, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "#D85D5D";
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 2px 6px rgba(197, 74, 74, 0.2)";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        background: "#FFFEF9",
        borderBottom: "1px solid #E8DCC8",
        boxShadow: "0 2px 8px rgba(139, 111, 71, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100
    },
    container: {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    leftSection: {
        display: "flex",
        alignItems: "center",
        gap: "40px"
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "transform 0.2s ease"
    },
    brandIcon: {
        fontSize: "28px"
    },
    brandText: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#6B4423",
        letterSpacing: "-0.5px"
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    navLink: {
        fontSize: "15px",
        fontWeight: "600",
        color: "#6B5B4F",
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        userSelect: "none"
    },
    rightSection: {
        display: "flex",
        alignItems: "center"
    },
    logoutButton: {
        background: "#D85D5D",
        color: "#FFFEF9",
        border: "none",
        borderRadius: "8px",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 6px rgba(197, 74, 74, 0.2)"
    }
};

export default Navbar;