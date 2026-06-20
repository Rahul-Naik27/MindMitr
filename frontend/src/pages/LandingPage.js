import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();
    const [currentQuote, setCurrentQuote] = useState(0);
    const [scrollY, setScrollY] = useState(0);

    const quotes = [
        "Excellence is not an act, but a habit",
        "Small daily improvements lead to stunning results",
        "Your habits shape your identity",
        "Discipline is choosing what you want most over what you want now"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateX(-30px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }
                `}
            </style>
            
            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navContent}>
                    <div style={styles.logoContainer}>
                        <span style={styles.logoIcon}>📔</span>
                        <span style={styles.logoText}>MindMitr</span>
                    </div>
                    <div style={styles.navButtons}>
                        <button 
                            style={styles.navLoginButton}
                            onClick={() => navigate("/login")}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#6B4423";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#8B6F47";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            Login
                        </button>
                        <button 
                            style={styles.navRegisterButton}
                            onClick={() => navigate("/register")}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#6B4423";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(107, 68, 35, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#8B6F47";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(107, 68, 35, 0.2)";
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.heroLeft}>
                        <h1 style={styles.heroTitle}>
                            Build Habits That
                            <span style={styles.heroTitleAccent}> Transform Your Life</span>
                        </h1>
                        <p style={styles.heroSubtitle}>
                            MindMitr is your trusted companion for tracking daily habits, building powerful streaks, and achieving consistent growth. Designed specifically for students who want to excel academically and personally.
                        </p>
                        
                        <div style={styles.quoteBox}>
                            <div style={styles.quoteIcon}>"</div>
                            <p style={styles.quote} key={currentQuote}>
                                {quotes[currentQuote]}
                            </p>
                        </div>

                        <div style={styles.heroButtons}>
                            <button 
                                style={styles.primaryButton}
                                onClick={() => navigate("/register")}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#6B4423";
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(107, 68, 35, 0.35)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#8B6F47";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(107, 68, 35, 0.25)";
                                }}
                            >
                                Start Your Journey
                            </button>
                            <button 
                                style={styles.secondaryButton}
                                onClick={() => navigate("/login")}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#F5F5F0";
                                    e.currentTarget.style.borderColor = "#6B4423";
                                    e.currentTarget.style.color = "#6B4423";
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.borderColor = "#8B6F47";
                                    e.currentTarget.style.color = "#8B6F47";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                Sign In
                            </button>
                        </div>

                        <div style={styles.statsRow}>
                            <div style={styles.statItem}>
                                <div style={styles.statNumber}>12K+</div>
                                <div style={styles.statLabel}>Active Students</div>
                            </div>
                            <div style={styles.statDivider}></div>
                            <div style={styles.statItem}>
                                <div style={styles.statNumber}>850K+</div>
                                <div style={styles.statLabel}>Habits Completed</div>
                            </div>
                            <div style={styles.statDivider}></div>
                            <div style={styles.statItem}>
                                <div style={styles.statNumber}>94%</div>
                                <div style={styles.statLabel}>Success Rate</div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.heroRight}>
                        <div style={styles.imageContainer}>
                            <div style={styles.imagePlaceholder}>
                                <div style={styles.habitCard}>
                                    <div style={styles.habitIcon}>📚</div>
                                    <div style={styles.habitInfo}>
                                        <div style={styles.habitName}>Study Time</div>
                                        <div style={styles.habitStreak}>🔥 15 day streak</div>
                                    </div>
                                    <div style={styles.habitCheck}>✓</div>
                                </div>
                                <div style={{...styles.habitCard, animationDelay: "0.2s"}}>
                                    <div style={styles.habitIcon}>🏃</div>
                                    <div style={styles.habitInfo}>
                                        <div style={styles.habitName}>Morning Run</div>
                                        <div style={styles.habitStreak}>🔥 8 day streak</div>
                                    </div>
                                    <div style={styles.habitCheck}>✓</div>
                                </div>
                                <div style={{...styles.habitCard, animationDelay: "0.4s"}}>
                                    <div style={styles.habitIcon}>💧</div>
                                    <div style={styles.habitInfo}>
                                        <div style={styles.habitName}>Drink Water</div>
                                        <div style={styles.habitStreak}>🔥 30 day streak</div>
                                    </div>
                                    <div style={styles.habitCheck}>✓</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={styles.features}>
                <div style={styles.featuresContent}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Everything You Need to Succeed</h2>
                        <p style={styles.sectionSubtitle}>Powerful features designed to help you build lasting habits</p>
                    </div>

                    <div style={styles.featuresGrid}>
                        <div 
                            style={styles.featureCard}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 15px 40px rgba(107, 68, 35, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 111, 71, 0.1)";
                            }}
                        >
                            <div style={styles.featureIconBox}>📊</div>
                            <h3 style={styles.featureTitle}>Track Progress</h3>
                            <p style={styles.featureDesc}>Monitor your daily habits with intuitive tracking and visual progress indicators that keep you motivated.</p>
                        </div>

                        <div 
                            style={styles.featureCard}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 15px 40px rgba(107, 68, 35, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 111, 71, 0.1)";
                            }}
                        >
                            <div style={styles.featureIconBox}>🔥</div>
                            <h3 style={styles.featureTitle}>Build Streaks</h3>
                            <p style={styles.featureDesc}>Create momentum with streak tracking that celebrates your consistency and encourages daily commitment.</p>
                        </div>

                        <div 
                            style={styles.featureCard}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 15px 40px rgba(107, 68, 35, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 111, 71, 0.1)";
                            }}
                        >
                            <div style={styles.featureIconBox}>💡</div>
                            <h3 style={styles.featureTitle}>Daily Motivation</h3>
                            <p style={styles.featureDesc}>Receive inspiring quotes and reminders that keep you focused on your goals and maintain momentum.</p>
                        </div>

                        <div 
                            style={styles.featureCard}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 15px 40px rgba(107, 68, 35, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 111, 71, 0.1)";
                            }}
                        >
                            <div style={styles.featureIconBox}>🎯</div>
                            <h3 style={styles.featureTitle}>Custom Goals</h3>
                            <p style={styles.featureDesc}>Set personalized habit goals tailored to your lifestyle and track your journey towards achieving them.</p>
                        </div>

                        <div 
                            style={styles.featureCard}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 15px 40px rgba(107, 68, 35, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 111, 71, 0.1)";
                            }}
                        >
                            <div style={styles.featureIconBox}>📈</div>
                            <h3 style={styles.featureTitle}>Analytics</h3>
                            <p style={styles.featureDesc}>Gain insights with detailed analytics and charts that help you understand your habit patterns.</p>
                        </div>

                        <div 
                            style={styles.featureCard}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 15px 40px rgba(107, 68, 35, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 111, 71, 0.1)";
                            }}
                        >
                            <div style={styles.featureIconBox}>⏰</div>
                            <h3 style={styles.featureTitle}>Smart Reminders</h3>
                            <p style={styles.featureDesc}>Never miss a habit with intelligent reminders that adapt to your schedule and preferences.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.cta}>
                <div style={styles.ctaContent}>
                    <h2 style={styles.ctaTitle}>Ready to Transform Your Daily Routine?</h2>
                    <p style={styles.ctaSubtitle}>Join thousands of students building better habits every day</p>
                    <button 
                        style={styles.ctaButton}
                        onClick={() => navigate("/register")}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#6B4423";
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 10px 30px rgba(107, 68, 35, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#8B6F47";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(107, 68, 35, 0.3)";
                        }}
                    >
                        Start Now
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerLeft}>
                        <div style={styles.footerLogo}>
                            <span style={styles.footerLogoIcon}>📔</span>
                            <span style={styles.footerLogoText}>MindMitr</span>
                        </div>
                        <p style={styles.footerTagline}>Building better habits, one day at a time</p>
                    </div>
                    <div style={styles.footerRight}>
                        <p style={styles.footerCopy}>© 2025 MindMitr. Empowering students worldwide.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#FFFEF9",
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    nav: {
        position: "sticky",
        top: 0,
        background: "rgba(255, 254, 249, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #E8DCC8",
        padding: "20px 0",
        zIndex: 100
    },
    navContent: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    logoIcon: {
        fontSize: "28px"
    },
    logoText: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#6B4423",
        letterSpacing: "-0.5px"
    },
    navButtons: {
        display: "flex",
        gap: "15px"
    },
    navLoginButton: {
        padding: "10px 24px",
        background: "transparent",
        border: "none",
        color: "#8B6F47",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        borderRadius: "8px",
        transition: "all 0.3s ease"
    },
    navRegisterButton: {
        padding: "10px 24px",
        background: "#8B6F47",
        border: "none",
        color: "#FFFEF9",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(107, 68, 35, 0.2)"
    },
    hero: {
        padding: "80px 40px",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    heroContent: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        alignItems: "center"
    },
    heroLeft: {
        animation: "slideIn 0.8s ease-out"
    },
    heroTitle: {
        fontSize: "56px",
        fontWeight: "800",
        color: "#2C1810",
        lineHeight: "1.1",
        marginBottom: "24px",
        letterSpacing: "-1.5px"
    },
    heroTitleAccent: {
        color: "#8B6F47",
        display: "block"
    },
    heroSubtitle: {
        fontSize: "18px",
        color: "#6B5B4F",
        lineHeight: "1.7",
        marginBottom: "32px",
        fontWeight: "400"
    },
    quoteBox: {
        background: "linear-gradient(135deg, #F5EFE6 0%, #E8DCC8 100%)",
        padding: "24px 28px",
        borderRadius: "12px",
        borderLeft: "4px solid #8B6F47",
        marginBottom: "40px",
        position: "relative"
    },
    quoteIcon: {
        fontSize: "48px",
        color: "#D4B896",
        position: "absolute",
        top: "10px",
        left: "15px",
        opacity: 0.3,
        fontFamily: "Georgia, serif"
    },
    quote: {
        fontSize: "16px",
        color: "#6B4423",
        fontStyle: "italic",
        lineHeight: "1.6",
        paddingLeft: "35px",
        margin: 0,
        animation: "fadeIn 0.6s ease-in"
    },
    heroButtons: {
        display: "flex",
        gap: "16px",
        marginBottom: "50px"
    },
    primaryButton: {
        padding: "16px 36px",
        background: "#8B6F47",
        border: "none",
        color: "#FFFEF9",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        borderRadius: "10px",
        transition: "all 0.3s ease",
        boxShadow: "0 5px 15px rgba(107, 68, 35, 0.25)"
    },
    secondaryButton: {
        padding: "16px 36px",
        background: "transparent",
        border: "2px solid #8B6F47",
        color: "#8B6F47",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        borderRadius: "10px",
        transition: "all 0.3s ease"
    },
    statsRow: {
        display: "flex",
        alignItems: "center",
        gap: "30px"
    },
    statItem: {
        textAlign: "left"
    },
    statNumber: {
        fontSize: "32px",
        fontWeight: "800",
        color: "#8B6F47",
        marginBottom: "4px"
    },
    statLabel: {
        fontSize: "13px",
        color: "#8B7355",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontWeight: "600"
    },
    statDivider: {
        width: "1px",
        height: "40px",
        background: "#E8DCC8"
    },
    heroRight: {
        animation: "fadeIn 1s ease-out"
    },
    imageContainer: {
        position: "relative"
    },
    imagePlaceholder: {
        background: "linear-gradient(135deg, #F5EFE6 0%, #E8DCC8 100%)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 60px rgba(139, 111, 71, 0.15)",
        border: "1px solid #E8DCC8"
    },
    habitCard: {
        background: "#FFFEF9",
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
        boxShadow: "0 4px 12px rgba(107, 68, 35, 0.08)",
        border: "1px solid #F5EFE6",
        animation: "float 3s ease-in-out infinite"
    },
    habitIcon: {
        fontSize: "32px"
    },
    habitInfo: {
        flex: 1
    },
    habitName: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#2C1810",
        marginBottom: "4px"
    },
    habitStreak: {
        fontSize: "13px",
        color: "#8B6F47",
        fontWeight: "500"
    },
    habitCheck: {
        width: "32px",
        height: "32px",
        background: "#8B6F47",
        color: "#FFFEF9",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "700"
    },
    features: {
        padding: "100px 40px",
        background: "#F5EFE6"
    },
    featuresContent: {
        maxWidth: "1200px",
        margin: "0 auto"
    },
    sectionHeader: {
        textAlign: "center",
        marginBottom: "60px"
    },
    sectionTitle: {
        fontSize: "42px",
        fontWeight: "800",
        color: "#2C1810",
        marginBottom: "16px",
        letterSpacing: "-1px"
    },
    sectionSubtitle: {
        fontSize: "18px",
        color: "#6B5B4F",
        fontWeight: "400"
    },
    featuresGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "30px"
    },
    featureCard: {
        background: "#FFFEF9",
        padding: "40px 30px",
        borderRadius: "16px",
        border: "1px solid #E8DCC8",
        transition: "all 0.3s ease",
        boxShadow: "0 8px 25px rgba(139, 111, 71, 0.1)"
    },
    featureIconBox: {
        width: "60px",
        height: "60px",
        background: "linear-gradient(135deg, #F5EFE6 0%, #E8DCC8 100%)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        marginBottom: "20px"
    },
    featureTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#2C1810",
        marginBottom: "12px"
    },
    featureDesc: {
        fontSize: "15px",
        color: "#6B5B4F",
        lineHeight: "1.6"
    },
    cta: {
        padding: "100px 40px",
        background: "linear-gradient(135deg, #8B6F47 0%, #6B4423 100%)",
        textAlign: "center"
    },
    ctaContent: {
        maxWidth: "700px",
        margin: "0 auto"
    },
    ctaTitle: {
        fontSize: "42px",
        fontWeight: "800",
        color: "#FFFEF9",
        marginBottom: "16px",
        letterSpacing: "-1px"
    },
    ctaSubtitle: {
        fontSize: "18px",
        color: "rgba(255, 254, 249, 0.9)",
        marginBottom: "40px"
    },
    ctaButton: {
        padding: "18px 48px",
        background: "#8B6F47",
        border: "2px solid #FFFEF9",
        color: "#FFFEF9",
        fontSize: "17px",
        fontWeight: "700",
        cursor: "pointer",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        boxShadow: "0 6px 20px rgba(107, 68, 35, 0.3)"
    },
    footer: {
        padding: "50px 40px",
        background: "#2C1810",
        borderTop: "1px solid #4A3628"
    },
    footerContent: {
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    footerLeft: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    footerLogo: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    footerLogoIcon: {
        fontSize: "24px"
    },
    footerLogoText: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#D4B896"
    },
    footerTagline: {
        fontSize: "14px",
        color: "#A89583",
        margin: 0
    },
    footerRight: {
        textAlign: "right"
    },
    footerCopy: {
        fontSize: "14px",
        color: "#8B7355",
        margin: 0
    }
};

export default LandingPage;