import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { getProfile, getProjects, getRecentActivity } from "../Services/api"
import ThemeToggle from "../components/ThemeToggle"

// Styles
const dashboardStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }

  @keyframes floatReverse {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(20px) rotate(-5deg); }
  }

  @keyframes orbit {
    0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  @keyframes drift {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(20px, -20px); }
    50% { transform: translate(40px, 0); }
    75% { transform: translate(20px, 20px); }
  }

  @keyframes moleculeSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.02; }
    50% { opacity: 0.05; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-slideIn {
    animation: slideIn 0.4s ease-out forwards;
  }

  .floating-element {
    animation: float 8s ease-in-out infinite;
  }

  .floating-element-reverse {
    animation: floatReverse 10s ease-in-out infinite;
  }

  .orbiting {
    animation: orbit 4s linear infinite;
  }

  .pulsing {
    animation: pulse 3s ease-in-out infinite;
  }

  .drifting {
    animation: drift 15s ease-in-out infinite;
  }

  .molecule-spin {
    animation: moleculeSpin 20s linear infinite;
  }

  .dashboard-bg {
    background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 30%, #f0f9ff 60%, #f5f3ff 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }

  .glass-sidebar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(226, 232, 240, 0.8);
  }

  .sidebar-item {
    transition: all 0.2s ease;
  }

  .sidebar-item:hover {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(99, 102, 241, 0.1));
    transform: translateX(4px);
  }

  .sidebar-item.active {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.15));
    border-left: 3px solid #0ea5e9;
  }

  .project-card {
    transition: all 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .create-btn {
    background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%);
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
    transition: all 0.3s ease;
  }

  .create-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4);
  }

  .profile-dropdown {
    animation: fadeIn 0.2s ease-out;
  }

  /* Dark Dropdown Theme */
  .dark-dropdown {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  }

  .dark-dropdown-item {
    transition: all 0.2s ease;
  }

  .dark-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .dark-dropdown-danger:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  .stage-badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .hero-pattern {
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 50%);
  }

  .empty-state-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%);
    border: 2px dashed #e2e8f0;
  }

  .empty-state-card:hover {
    border-color: #a5b4fc;
    background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(238,242,255,0.95) 100%);
  }
`

// Background Molecules Component
const ScienceBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Grid Pattern */}
    <div 
      className="absolute inset-0" 
      style={{
        backgroundImage: `
          linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        animation: 'gridPulse 4s ease-in-out infinite'
      }}
    />

    {/* Large Molecule - Top Right */}
    <div className="absolute top-20 right-20 floating-element" style={{ animationDelay: '0s' }}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" opacity="0.15">
        <circle cx="60" cy="60" r="15" fill="#0ea5e9" className="pulsing" />
        <circle cx="25" cy="35" r="10" fill="#8b5cf6" />
        <circle cx="95" cy="35" r="10" fill="#8b5cf6" />
        <circle cx="25" cy="85" r="10" fill="#10b981" />
        <circle cx="95" cy="85" r="10" fill="#10b981" />
        <line x1="60" y1="60" x2="25" y2="35" stroke="#94a3b8" strokeWidth="2" />
        <line x1="60" y1="60" x2="95" y2="35" stroke="#94a3b8" strokeWidth="2" />
        <line x1="60" y1="60" x2="25" y2="85" stroke="#94a3b8" strokeWidth="2" />
        <line x1="60" y1="60" x2="95" y2="85" stroke="#94a3b8" strokeWidth="2" />
      </svg>
    </div>

    {/* DNA Helix - Left Side */}
    <div className="absolute left-10 top-1/3 floating-element-reverse" style={{ animationDelay: '2s' }}>
      <svg width="50" height="150" viewBox="0 0 50 150" fill="none" opacity="0.12">
        {[...Array(8)].map((_, i) => (
          <g key={i}>
            <circle cx={25 + Math.sin(i * 0.8) * 15} cy={i * 18 + 10} r="4" fill="#0ea5e9" />
            <circle cx={25 - Math.sin(i * 0.8) * 15} cy={i * 18 + 10} r="4" fill="#8b5cf6" />
            <line 
              x1={25 + Math.sin(i * 0.8) * 15} 
              y1={i * 18 + 10} 
              x2={25 - Math.sin(i * 0.8) * 15} 
              y2={i * 18 + 10} 
              stroke="#94a3b8" 
              strokeWidth="1.5" 
            />
          </g>
        ))}
      </svg>
    </div>

    {/* Benzene Ring - Bottom Left */}
    <div className="absolute bottom-32 left-1/4 molecule-spin" style={{ animationDuration: '30s' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.1">
        <polygon 
          points="40,8 72,24 72,56 40,72 8,56 8,24" 
          stroke="#6366f1" 
          strokeWidth="2" 
          fill="none"
        />
        <polygon 
          points="40,18 62,30 62,50 40,62 18,50 18,30" 
          stroke="#8b5cf6" 
          strokeWidth="1.5" 
          fill="none"
        />
        {[
          { cx: 40, cy: 8 },
          { cx: 72, cy: 24 },
          { cx: 72, cy: 56 },
          { cx: 40, cy: 72 },
          { cx: 8, cy: 56 },
          { cx: 8, cy: 24 }
        ].map((pos, i) => (
          <circle key={i} cx={pos.cx} cy={pos.cy} r="4" fill="#10b981" />
        ))}
      </svg>
    </div>

    {/* Floating Atoms */}
    {[
      { top: '15%', right: '15%', color: '#0ea5e9', delay: '0s', size: 50 },
      { top: '60%', right: '10%', color: '#8b5cf6', delay: '3s', size: 40 },
      { bottom: '20%', right: '25%', color: '#10b981', delay: '1s', size: 45 },
      { top: '40%', left: '5%', color: '#f59e0b', delay: '2s', size: 35 },
      { bottom: '40%', left: '15%', color: '#ec4899', delay: '4s', size: 42 },
    ].map((atom, index) => (
      <div
        key={index}
        className="absolute floating-element"
        style={{ 
          top: atom.top, 
          bottom: atom.bottom,
          left: atom.left, 
          right: atom.right,
          animationDelay: atom.delay,
          animationDuration: `${8 + index * 2}s`
        }}
      >
        <div className="relative" style={{ width: atom.size, height: atom.size }}>
          <div 
            className="absolute rounded-full pulsing"
            style={{
              width: atom.size * 0.35,
              height: atom.size * 0.35,
              background: atom.color,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 20px ${atom.color}30`,
              opacity: 0.6
            }}
          />
          {[0, 1, 2].map((orbit) => (
            <div
              key={orbit}
              className="absolute orbiting"
              style={{
                width: 6,
                height: 6,
                background: `${atom.color}80`,
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                marginTop: -3,
                marginLeft: -3,
                animationDelay: `${orbit * 1.3}s`,
                animationDuration: `${3 + orbit}s`
              }}
            />
          ))}
          <div 
            className="absolute rounded-full border opacity-20"
            style={{
              width: atom.size * 0.9,
              height: atom.size * 0.9,
              borderColor: atom.color,
              borderWidth: 1.5,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>
    ))}

    {/* Small Floating Particles */}
    {[...Array(15)].map((_, i) => (
      <div
        key={`particle-${i}`}
        className="absolute rounded-full drifting"
        style={{
          width: Math.random() * 6 + 3,
          height: Math.random() * 6 + 3,
          background: ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: 0.15,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }}
      />
    ))}

    {/* Water Molecule - Center Right */}
    <div className="absolute top-1/2 right-32 floating-element-reverse" style={{ animationDelay: '1s' }}>
      <svg width="70" height="50" viewBox="0 0 70 50" fill="none" opacity="0.12">
        <circle cx="35" cy="25" r="12" fill="#ef4444" />
        <circle cx="12" cy="35" r="8" fill="#3b82f6" />
        <circle cx="58" cy="35" r="8" fill="#3b82f6" />
        <line x1="35" y1="25" x2="12" y2="35" stroke="#94a3b8" strokeWidth="2" />
        <line x1="35" y1="25" x2="58" y2="35" stroke="#94a3b8" strokeWidth="2" />
      </svg>
    </div>
  </div>
)

// Icons
const Icons = {
  projects: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  activity: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  ),
  star: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  starFilled: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  history: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  resources: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  terms: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  chevronDown: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  chevronRight: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  chevronLeft: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  flask: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v2H9z"></path>
      <path d="M10 5v4.5L6.5 15H6a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4h-.5L14 9.5V5"></path>
    </svg>
  ),
  hypothesis: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  failure: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  assumption: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  ),
  menu: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  building: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
    </svg>
  ),
  location: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  science: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v2H9z"></path>
      <path d="M10 5v4.5L6.5 15H6a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4h-.5L14 9.5V5"></path>
    </svg>
  ),
  empty: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  ),
  rocket: (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
    </svg>
  ),
}

// Helper functions
const getDomainField = (profile) => {
  if (!profile) return null
  switch (profile.role) {
    case "Researcher":
      return { label: "Research Domain", value: profile.primaryResearchDomain }
    case "R&D Engineer":
      return { label: "Engineering Domain", value: profile.engineeringDomain }
    case "Scientist":
      return { label: "Scientific Discipline", value: profile.scientificDiscipline }
    case "Product Analyst":
      return { label: "Product Domain", value: profile.productDomain }
    default:
      return null
  }
}

const getStageColor = (stage) => {
  switch (stage) {
    case "Hypothesis":
      return "bg-blue-100 text-blue-700"
    case "Failure Analysis":
      return "bg-amber-100 text-amber-700"
    case "Assumption":
      return "bg-emerald-100 text-emerald-700"
    case "Validation":
      return "bg-purple-100 text-purple-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getRoleIcon = (role) => {
  switch (role) {
    case "Researcher": return "🔬"
    case "R&D Engineer": return "⚙️"
    case "Scientist": return "🧪"
    case "Product Analyst": return "📊"
    default: return "👤"
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000)
    return `${mins}m ago`
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diff / 86400000)
    return `${days}d ago`
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("ongoing")
  const dropdownRef = useRef(null)

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login", { replace: true })
        return
      }

      try {
        const profileRes = await getProfile()
        if (profileRes.success) {
          setProfile(profileRes.profile)
        } else {
          navigate("/profile-setup", { replace: true })
          return
        }

        const projectsRes = await getProjects()
        if (projectsRes.success) {
          setProjects(projectsRes.projects || [])
        }

        const activityRes = await getRecentActivity()
        if (activityRes.success) {
          setRecentActivity(activityRes.activities || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login", { replace: true })
  }

  if (loading) {
    return (
      <div className="dashboard-bg flex items-center justify-center">
        <style>{dashboardStyles}</style>
        <ScienceBackground />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  const favoriteProjects = projects.filter(p => p.isFavorite)
  const domainField = getDomainField(profile)
  const displayName = profile?.fullName || profile?.full_name || "User"

  // Sidebar items configuration
  const sidebarItems = [
    { id: 'ongoing', icon: Icons.projects, label: 'Ongoing Projects', color: 'text-sky-600' },
    { id: 'activity', icon: Icons.activity, label: 'Recent Activity', color: 'text-emerald-600' },
    { id: 'favorites', icon: Icons.star, label: 'Favorites', color: 'text-amber-500' },
    { id: 'history', icon: Icons.history, label: 'Research History', color: 'text-purple-600' },
  ]

  return (
    <div className="dashboard-bg flex">
      <style>{dashboardStyles}</style>
      <ScienceBackground />

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`
        glass-sidebar fixed lg:sticky top-0 left-0 h-screen z-50
        transition-all duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'w-72' : 'w-20'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {sidebarOpen ? (
                <div className="flex items-center gap-3 animate-fadeIn">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white">
                    {Icons.flask}
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-800">SciReason</h1>
                    <p className="text-xs text-gray-500">Research OS</p>
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white mx-auto">
                  {Icons.flask}
                </div>
              )}
              <button 
                onClick={() => {
                  setSidebarOpen(!sidebarOpen)
                  setMobileSidebarOpen(false)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hidden lg:flex"
              >
                {sidebarOpen ? Icons.chevronLeft : Icons.chevronRight}
              </button>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"
              >
                {Icons.close}
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
            {/* Main Sidebar Items */}
            {sidebarItems.map(item => (
              <div key={item.id} className="px-3 mb-2">
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${activeSection === item.id ? 'active' : ''}`}
                >
                  <span className={item.color}>{item.icon}</span>
                  {sidebarOpen && <span className="font-medium text-gray-700">{item.label}</span>}
                </button>
                
                {sidebarOpen && activeSection === item.id && (
                  <div className="mt-2 pl-2 animate-fadeIn">
                    {/* Ongoing Projects Content */}
                    {item.id === 'ongoing' && (
                      projects.length > 0 ? (
                        <div className="space-y-1">
                          {projects.slice(0, 5).map((project) => (
                            <button
                              key={project.id}
                              onClick={() => navigate(`/project/${project.id}`)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 group"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700 truncate pr-2">{project.title}</p>
                                {project.isFavorite && (
                                  <span className="text-amber-500 flex-shrink-0">{Icons.starFilled}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">{project.domain}</span>
                                <span className={`stage-badge ${getStageColor(project.stage)}`}>
                                  {project.stage}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 px-3 py-2">No projects yet</p>
                      )
                    )}

                    {/* Activity Content */}
                    {item.id === 'activity' && (
                      recentActivity.length > 0 ? (
                        <div className="space-y-1">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="px-3 py-2 rounded-lg hover:bg-gray-50">
                              <p className="text-sm text-gray-700">{activity.action}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-400 truncate">{activity.project}</span>
                                <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 px-3 py-2">No recent activity</p>
                      )
                    )}

                    {/* Favorites Content */}
                    {item.id === 'favorites' && (
                      favoriteProjects.length > 0 ? (
                        <div className="space-y-1">
                          {favoriteProjects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => navigate(`/project/${project.id}`)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50"
                            >
                              <p className="text-sm text-gray-700 truncate">{project.title}</p>
                              <span className="text-xs text-gray-400">{project.domain}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 px-3 py-2">No favorites yet</p>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Divider */}
            {sidebarOpen && <div className="mx-4 my-4 border-t border-gray-100"></div>}

            {/* Scientific Resources */}
            <div className="px-3 mb-4">
              <button
                onClick={() => setActiveSection("resources")}
                className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${activeSection === "resources" ? "active" : ""}`}
              >
                <span className="text-indigo-600">{Icons.resources}</span>
                {sidebarOpen && <span className="font-medium text-gray-700">Scientific Resources</span>}
              </button>
              
              {sidebarOpen && activeSection === "resources" && (
                <div className="mt-2 space-y-1 pl-2 animate-fadeIn">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                    📋 Hypothesis Templates
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                    🔍 Failure Analysis Frameworks
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                    ✅ Validation Checklists
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-100 p-3">
            <button
              onClick={() => setActiveSection("terms")}
              className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${activeSection === "terms" ? "active" : ""}`}
            >
              <span className="text-gray-500">{Icons.terms}</span>
              {sidebarOpen && <span className="text-sm text-gray-600">Terms & Ethics</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen relative z-10">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
          <div className="flex items-center justify-between px-6 py-3">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              {Icons.menu}
            </button>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Avatar */}
            <div className="relative ml-3" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow ring-2 ring-white overflow-hidden"
              >
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{displayName.charAt(0)}</span>
                )}
              </button>

              {/* Dark Theme Dropdown */}
              {showProfileDropdown && (
                <div className="dark-dropdown absolute right-0 mt-3 w-80 rounded-2xl overflow-hidden animate-fadeIn">
                  {/* Profile Header */}
                  <div className="p-5 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg overflow-hidden">
                        {profile?.avatarUrl ? (
                          <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span>{displayName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg truncate">{displayName}</h3>
                        <p className="text-sm text-gray-400 truncate">{profile?.email}</p>
                        <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-sm">
                          {getRoleIcon(profile?.role)} {profile?.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-4 space-y-3 border-b border-white/10">
                    {profile?.organization && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">{Icons.building}</span>
                        <span className="text-gray-300">{profile.organization}</span>
                      </div>
                    )}
                    {profile?.department && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">{Icons.projects}</span>
                        <span className="text-gray-300">{profile.department}</span>
                      </div>
                    )}
                    {(profile?.city || profile?.country) && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">{Icons.location}</span>
                        <span className="text-gray-300">
                          {[profile.city, profile.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                    {domainField && domainField.value && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">{Icons.science}</span>
                        <span className="text-gray-300">{domainField.value}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false)
                        navigate("/profile")
                      }}
                      className="dark-dropdown-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300"
                    >
                      {Icons.user}
                      <span className="font-medium">View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false)
                        navigate("/profile/edit")
                      }}
                      className="dark-dropdown-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300"
                    >
                      {Icons.edit}
                      <span className="font-medium">Edit Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="dark-dropdown-item dark-dropdown-danger w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400"
                    >
                      {Icons.logout}
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="px-6 lg:px-10 pt-4 pb-10">
          {/* Hero Section */}
          <section className="glass-card rounded-3xl p-8 lg:p-10 mb-8 hero-pattern animate-fadeIn relative overflow-hidden">
            <div className="max-w-4xl relative z-10">
              {/* Welcome Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Welcome back, {displayName.split(" ")[0]}
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                Scientific Reasoning OS
                <span className="block mt-2 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Where Research Becomes Intelligence
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">
                Transform your research process with AI-driven scientific reasoning. Generate and refine 
                <span className="font-semibold text-gray-800"> hypotheses</span>, perform deep 
                <span className="font-semibold text-gray-800"> failure analysis</span>, build and validate 
                <span className="font-semibold text-gray-800"> assumptions</span>, and structure your reasoning 
                with evidence-based, research-grade outputs.
              </p>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Icons.hypothesis, label: 'Evidence-Based', color: 'bg-blue-100 text-blue-600' },
                  { icon: Icons.failure, label: 'Multi-Modal AI', color: 'bg-amber-100 text-amber-600' },
                  { icon: Icons.assumption, label: 'Research-Grade', color: 'bg-emerald-100 text-emerald-600' },
                ].map((f, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${f.color}`}>
                    {f.icon}
                    <span className="text-sm font-medium">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/project/new")}
                className="create-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl"
              >
                {Icons.plus}
                Create New Research Project
              </button>
            </div>
          </section>

          {/* Projects Section */}
          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">Your Projects</h2>
              {projects.length > 0 && (
                <button onClick={() => navigate("/projects")} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  View all {Icons.chevronRight}
                </button>
              )}
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <div 
                    key={project.id}
                    className="project-card glass-card rounded-2xl p-6 cursor-pointer"
                    style={{ animationDelay: `${0.1 * index}s` }}
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-500">{project.domain}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          // Toggle favorite API call
                        }}
                        className={`p-2 rounded-lg transition-colors ${project.isFavorite ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50'}`}
                      >
                        {project.isFavorite ? Icons.starFilled : Icons.star}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`stage-badge ${getStageColor(project.stage)}`}>
                        {project.stage}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(project.updatedAt)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* New Project Card */}
                <button
                  onClick={() => navigate("/project/new")}
                  className="glass-card rounded-2xl p-6 border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-2 min-h-[160px]"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    {Icons.plus}
                  </div>
                  <span className="font-medium text-gray-600">New Project</span>
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-5 text-indigo-500">
                  {Icons.rocket}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Start Your Research Journey</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Create your first project to begin generating hypotheses and analyzing research with AI.
                </p>
                <button
                  onClick={() => navigate("/project/new")}
                  className="create-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold shadow-lg"
                >
                  {Icons.plus}
                  Create Your First Project
                </button>
              </div>
            )}
          </section>

          {/* Quick Stats - Only show when there are projects */}
          {projects.length > 0 && (
            <section className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                    {Icons.projects}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
                    <p className="text-sm text-gray-500">Active Projects</p>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    {Icons.hypothesis}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {projects.filter(p => p.stage === "Hypothesis").length}
                    </p>
                    <p className="text-sm text-gray-500">Hypotheses</p>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    {Icons.failure}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {projects.filter(p => p.stage === "Failure Analysis").length}
                    </p>
                    <p className="text-sm text-gray-500">Analyses</p>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500">
                    {Icons.starFilled}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{favoriteProjects.length}</p>
                    <p className="text-sm text-gray-500">Favorites</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}