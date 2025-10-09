import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, Target, Zap, Calendar, Award, ChevronRight, Sparkles, Star, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MindMitraLanding() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Target style={{ width: '48px', height: '48px' }} />,
      title: "Track Your Wins",
      description: "Add your daily habits and tick them off - it's super satisfying! Watch yourself grow one checkmark at a time."
    },
    {
      icon: <TrendingUp style={{ width: '48px', height: '48px' }} />,
      title: "See Your Streak",
      description: "Keep the momentum going! Your streak counter shows how many days you've stayed consistent. Can you beat your record?"
    },
    {
      icon: <Sparkles style={{ width: '48px', height: '48px' }} />,
      title: "Daily Motivation",
      description: "Get a friendly nudge every day with quotes that'll make you smile and keep you pumped to crush your goals."
    },
    {
      icon: <Award style={{ width: '48px', height: '48px' }} />,
      title: "Earn Cool Badges",
      description: "Unlock awesome achievements as you build your habits. Collect them all and show off your dedication!"
    }
  ];

  const testimonials = [
    {
      text: "MindMitra is literally my study buddy now! I haven't broken my 30-day reading streak and I'm so proud 📚",
      author: "Ria T.",
      role: "Computer Science, 2nd Year",
      emoji: "🎯"
    },
    {
      text: "Finally a habit tracker that doesn't feel like homework! It's simple, cute, and actually works for me.",
      author: "Arjun P.",
      role: "Commerce Student",
      emoji: "✨"
    },
    {
      text: "The daily quotes hit different when you're pulling an all-nighter 😅 MindMitra keeps me going!",
      author: "Neha S.",
      role: "Engineering Student",
      emoji: "💪"
    }
  ];

  const stats = [
    { number: "15K+", label: "Happy Students", emoji: "🎓" },
    { number: "75K+", label: "Habits Crushed", emoji: "🔥" },
    { number: "90%", label: "Keep Coming Back", emoji: "💯" }
  ];

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#C9B5A0',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: scrollY > 50 ? 'rgba(201, 181, 160, 0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Heart style={{ width: '32px', height: '32px', fill: '#fff' }} />
          MindMitra
        </div>
        <button style={{
          backgroundColor: '#6B4E3D',
          color: '#ffffff',
          border: 'none',
          padding: '12px 32px',
          borderRadius: '30px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
        onClick={() => navigate('/login')}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px) scale(1.05)';
          e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          e.target.style.backgroundColor = '#5A3F2E';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          e.target.style.backgroundColor = '#6B4E3D';
        }}>
          Start Free - No CC! 🎉
        </button>
      </nav>

      {/* Hero Section */}
      <div style={{
        padding: '180px 40px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          fontSize: '100px',
          opacity: '0.15',
          animation: 'float 4s ease-in-out infinite'
        }}>✨</div>
        
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          fontSize: '80px',
          opacity: '0.15',
          animation: 'float 5s ease-in-out infinite 1s'
        }}>🎯</div>

        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '8px 20px',
          borderRadius: '20px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Your friendly habit-building companion 🤝
        </div>
        
        <h1 style={{
          fontSize: '68px',
          fontWeight: 'bold',
          marginBottom: '24px',
          lineHeight: '1.2',
          animation: 'fadeInUp 1s ease-out'
        }}>
          Hey There! Let's Build<br />
          <span style={{ 
            color: '#F5F5F5',
            textShadow: '2px 2px 8px rgba(0,0,0,0.2)'
          }}>
            Awesome Habits Together
          </span>
        </h1>
        
        <p style={{
          fontSize: '24px',
          marginBottom: '40px',
          opacity: 0.95,
          maxWidth: '750px',
          margin: '0 auto 40px',
          lineHeight: '1.6',
          fontWeight: '400'
        }}>
          MindMitra is your chill buddy for tracking habits, celebrating wins, and staying motivated - made by students, for students! 🚀
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            backgroundColor: '#ffffff',
            color: '#6B4E3D',
            border: 'none',
            padding: '18px 48px',
            borderRadius: '35px',
            fontSize: '20px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onClick={() => navigate('/login')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
          }}>
            Let's Go! It's Free 🎈 <ChevronRight style={{ width: '24px', height: '24px' }} />
          </button>
          
          <button style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            border: '2px solid #ffffff',
            padding: '18px 48px',
            borderRadius: '35px',
            fontSize: '20px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}>
            Watch How It Works 📹
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '60px',
          marginTop: '90px',
          flexWrap: 'wrap'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ 
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '30px 40px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}>
              <div style={{ fontSize: '52px', fontWeight: 'bold', marginBottom: '8px' }}>{stat.number}</div>
              <div style={{ fontSize: '18px', opacity: 0.95, fontWeight: '600' }}>{stat.label} {stat.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        backgroundColor: '#FAF7F4',
        color: '#4A4A4A',
        padding: '100px 40px',
        borderRadius: '60px 60px 0 0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '48px' }}>✨</div>
        <h2 style={{
          fontSize: '52px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
          color: '#6B4E3D'
        }}>
          What Makes MindMitra Special?
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '22px',
          color: '#7A7A7A',
          marginBottom: '60px',
          maxWidth: '650px',
          margin: '0 auto 60px'
        }}>
          Everything you need to build habits that stick - no confusing features, just the good stuff!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {features.map((feature, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              padding: '40px',
              borderRadius: '30px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '3px solid transparent',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) rotate(1deg)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(107, 78, 61, 0.25)';
              e.currentTarget.style.borderColor = '#C9B5A0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div style={{ 
                color: '#6B4E3D', 
                marginBottom: '20px',
                backgroundColor: '#F5EFE7',
                width: '70px',
                height: '70px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '12px', color: '#4A4A4A' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '17px', color: '#7A7A7A', lineHeight: '1.7' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{
        backgroundColor: '#FAF7F4',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '52px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#6B4E3D'
        }}>
          What Students Are Saying 💬
        </h2>
        <p style={{
          fontSize: '20px',
          color: '#7A7A7A',
          marginBottom: '50px'
        }}>
          Real students, real results, real happy vibes!
        </p>
        
        <div style={{
          maxWidth: '850px',
          margin: '0 auto',
          position: 'relative',
          height: '280px'
        }}>
          {testimonials.map((testimonial, idx) => (
            <div key={idx} style={{
              position: 'absolute',
              width: '100%',
              opacity: activeTestimonial === idx ? 1 : 0,
              transform: activeTestimonial === idx ? 'scale(1)' : 'scale(0.9)',
              transition: 'all 0.5s ease',
              pointerEvents: activeTestimonial === idx ? 'auto' : 'none'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '45px',
                borderRadius: '30px',
                boxShadow: '0 15px 40px rgba(107, 78, 61, 0.15)',
                border: '3px solid #E8DED0'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>{testimonial.emoji}</div>
                <p style={{ fontSize: '22px', color: '#4A4A4A', marginBottom: '28px', lineHeight: '1.7', fontWeight: '500' }}>
                  {testimonial.text}
                </p>
                <div style={{ fontWeight: 'bold', color: '#6B4E3D', fontSize: '20px' }}>
                  {testimonial.author}
                </div>
                <div style={{ color: '#999', fontSize: '16px', marginTop: '6px' }}>
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '50px' }}>
          {testimonials.map((_, idx) => (
            <div key={idx} style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: activeTestimonial === idx ? '#6B4E3D' : '#D4C4B0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: activeTestimonial === idx ? 'scale(1.3)' : 'scale(1)'
            }}
            onClick={() => setActiveTestimonial(idx)}></div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: '#C9B5A0',
        padding: '100px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          fontSize: '120px',
          opacity: '0.1',
          animation: 'float 6s ease-in-out infinite'
        }}>🎯</div>
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          fontSize: '100px',
          opacity: '0.1',
          animation: 'float 5s ease-in-out infinite 1.5s'
        }}>🚀</div>

        <h2 style={{
          fontSize: '56px',
          fontWeight: 'bold',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1,
          color: '#ffffff'
        }}>
          Ready to Be Your Best Self? 🌟
        </h2>
        <p style={{
          fontSize: '24px',
          marginBottom: '40px',
          opacity: 0.95,
          position: 'relative',
          zIndex: 1,
          maxWidth: '700px',
          margin: '0 auto 40px',
          color: '#ffffff'
        }}>
          Join the MindMitra fam and start building habits that'll make future you super proud! No credit card, no hassle, just good vibes.
        </p>
        <button style={{
          backgroundColor: '#ffffff',
          color: '#6B4E3D',
          border: 'none',
          padding: '22px 70px',
          borderRadius: '40px',
          fontSize: '22px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1
        }}
        onClick={() => navigate('/login')}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-5px) scale(1.08)';
          e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        }}>
          Start Your Journey - Free Forever! 🎉
        </button>
        
        <p style={{
          marginTop: '20px',
          fontSize: '16px',
          opacity: 0.9,
          position: 'relative',
          zIndex: 1,
          color: '#ffffff'
        }}>
          💯 No catches, no spam, just pure habit-building goodness
        </p>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#3D3027',
        color: '#ffffff',
        padding: '50px 40px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px' 
        }}>
          <Heart style={{ width: '32px', height: '32px', fill: '#C9B5A0' }} />
          MindMitra
        </div>
        <p style={{ opacity: 0.8, marginBottom: '24px', fontSize: '18px' }}>
          Your friendly companion for building habits that stick 🌱
        </p>
        <p style={{ opacity: 0.6, fontSize: '16px', marginBottom: '20px' }}>
          Made with 💖 by students, for students
        </p>
        <div style={{ fontSize: '14px', opacity: 0.5 }}>
          © 2025 MindMitra. All rights reserved. Let's grow together! 🚀
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}