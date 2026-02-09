import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { saveProfile } from "../../Services/api"

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(1)

  const backgroundStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
      50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }
    
    @keyframes orbit {
      0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
    }
    
    @keyframes dnaRotate {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }
    
    @keyframes wave {
      0%, 100% { transform: translateX(0) translateY(0); }
      25% { transform: translateX(10px) translateY(-10px); }
      50% { transform: translateX(20px) translateY(0); }
      75% { transform: translateX(10px) translateY(10px); }
    }
    
    @keyframes moleculeFloat {
      0% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
    }

    @keyframes gridPulse {
      0%, 100% { opacity: 0.03; }
      50% { opacity: 0.08; }
    }

    .science-bg {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f0fdf4 50%, #ecfeff 75%, #f5f3ff 100%);
    }

    .floating-molecule {
      animation: moleculeFloat 20s ease-in-out infinite;
    }

    .floating-atom {
      animation: float 6s ease-in-out infinite;
    }

    .orbiting-electron {
      animation: orbit 3s linear infinite;
    }

    .pulsing-element {
      animation: pulse 4s ease-in-out infinite;
    }

    .dna-helix {
      animation: dnaRotate 10s linear infinite;
    }

    .waving-particle {
      animation: wave 5s ease-in-out infinite;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      padding-left: 2.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      outline: none;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    .form-input:focus {
      border-color: #0ea5e9;
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15), 0 4px 12px rgba(14, 165, 233, 0.1);
      background: white;
    }

    .form-input:hover:not(:focus) {
      border-color: #94a3b8;
    }

    .form-input::placeholder {
      color: #94a3b8;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      z-index: 10;
      pointer-events: none;
    }

    .required-star {
      color: #ef4444;
      margin-left: 2px;
    }

    .field-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    select.form-input {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.75rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
    }

    select.form-input option:disabled {
      color: #9ca3af;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .step-indicator {
      transition: all 0.3s ease;
    }

    .step-active {
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
      color: white;
      box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
    }

    .step-completed {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .step-pending {
      background: #e2e8f0;
      color: #64748b;
    }

    .submit-btn {
      background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%);
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    }

    .submit-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .section-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
    }

    .section-divider::before,
    .section-divider::after {
      content: '';
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, transparent, #cbd5e1, transparent);
    }

    .tooltip {
      position: relative;
    }

    .tooltip:hover::after {
      content: attr(data-tip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.5rem 0.75rem;
      background: #1e293b;
      color: white;
      font-size: 0.75rem;
      border-radius: 0.5rem;
      white-space: nowrap;
      z-index: 50;
      margin-bottom: 0.5rem;
    }

    .progress-bar {
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #0ea5e9, #6366f1);
      transition: width 0.5s ease;
    }
  `

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    if (savedRole) setRole(savedRole)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await saveProfile({ role, ...formData })
      if (res.success) {
        // Save role to localStorage for route guards
        localStorage.setItem("role", role)
        navigate("/dashboard", { replace: true })
      }
      else setError(res.message || "Failed to save profile")
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = () => {
    const requiredFields = ['fullName', 'gender', 'dob', 'city', 'country', 'department', 'email', 'phone']
    const filledFields = requiredFields.filter(field => formData[field])
    return Math.round((filledFields.length / requiredFields.length) * 100)
  }

  // Floating Science Elements Component
  const ScienceBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridPulse 4s ease-in-out infinite'
        }}
      />

      {/* DNA Helix Left */}
      <div className="absolute left-10 top-1/4 dna-helix" style={{ animationDelay: '0s' }}>
        <svg width="60" height="200" viewBox="0 0 60 200" fill="none" opacity="0.3">
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <circle cx={30 + Math.sin(i * 0.6) * 20} cy={i * 20 + 10} r="4" fill="#0ea5e9" />
              <circle cx={30 - Math.sin(i * 0.6) * 20} cy={i * 20 + 10} r="4" fill="#8b5cf6" />
              <line 
                x1={30 + Math.sin(i * 0.6) * 20} 
                y1={i * 20 + 10} 
                x2={30 - Math.sin(i * 0.6) * 20} 
                y2={i * 20 + 10} 
                stroke="#94a3b8" 
                strokeWidth="1" 
              />
            </g>
          ))}
        </svg>
      </div>

      {/* DNA Helix Right */}
      <div className="absolute right-10 bottom-1/4 dna-helix" style={{ animationDelay: '5s' }}>
        <svg width="60" height="200" viewBox="0 0 60 200" fill="none" opacity="0.3">
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <circle cx={30 + Math.cos(i * 0.6) * 20} cy={i * 20 + 10} r="4" fill="#10b981" />
              <circle cx={30 - Math.cos(i * 0.6) * 20} cy={i * 20 + 10} r="4" fill="#f59e0b" />
              <line 
                x1={30 + Math.cos(i * 0.6) * 20} 
                y1={i * 20 + 10} 
                x2={30 - Math.cos(i * 0.6) * 20} 
                y2={i * 20 + 10} 
                stroke="#94a3b8" 
                strokeWidth="1" 
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Floating Atoms */}
      {[
        { top: '10%', left: '15%', delay: '0s', color: '#0ea5e9' },
        { top: '20%', right: '20%', delay: '2s', color: '#8b5cf6' },
        { top: '60%', left: '8%', delay: '4s', color: '#10b981' },
        { top: '75%', right: '12%', delay: '1s', color: '#f59e0b' },
        { top: '40%', right: '5%', delay: '3s', color: '#ec4899' },
      ].map((atom, index) => (
        <div
          key={index}
          className="absolute floating-atom"
          style={{ 
            top: atom.top, 
            left: atom.left, 
            right: atom.right,
            animationDelay: atom.delay 
          }}
        >
          <div className="relative" style={{ width: '60px', height: '60px' }}>
            <div 
              className="absolute rounded-full pulsing-element"
              style={{
                width: '16px',
                height: '16px',
                background: atom.color,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 20px ${atom.color}40`
              }}
            />
            {[0, 1, 2].map((orbit) => (
              <div
                key={orbit}
                className="absolute orbiting-electron"
                style={{
                  width: '8px',
                  height: '8px',
                  background: `${atom.color}80`,
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%',
                  marginTop: '-4px',
                  marginLeft: '-4px',
                  animationDelay: `${orbit * 1}s`,
                  animationDuration: `${3 + orbit}s`
                }}
              />
            ))}
            <div 
              className="absolute rounded-full border-2 opacity-30"
              style={{
                width: '50px',
                height: '50px',
                borderColor: atom.color,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        </div>
      ))}

      {/* Molecule Structures */}
      <div className="absolute top-1/3 left-1/4 floating-molecule opacity-20">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="15" fill="#0ea5e9" />
          <circle cx="20" cy="40" r="10" fill="#8b5cf6" />
          <circle cx="100" cy="40" r="10" fill="#8b5cf6" />
          <circle cx="30" cy="100" r="10" fill="#10b981" />
          <circle cx="90" cy="100" r="10" fill="#10b981" />
          <line x1="60" y1="60" x2="20" y2="40" stroke="#94a3b8" strokeWidth="2" />
          <line x1="60" y1="60" x2="100" y2="40" stroke="#94a3b8" strokeWidth="2" />
          <line x1="60" y1="60" x2="30" y2="100" stroke="#94a3b8" strokeWidth="2" />
          <line x1="60" y1="60" x2="90" y2="100" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      </div>

      {/* Benzene Ring */}
      <div className="absolute bottom-20 right-1/4 floating-molecule opacity-20" style={{ animationDelay: '5s' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <polygon 
            points="50,10 90,30 90,70 50,90 10,70 10,30" 
            stroke="#0ea5e9" 
            strokeWidth="2" 
            fill="none"
          />
          <polygon 
            points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" 
            stroke="#8b5cf6" 
            strokeWidth="2" 
            fill="none"
          />
          {[
            { cx: 50, cy: 10 },
            { cx: 90, cy: 30 },
            { cx: 90, cy: 70 },
            { cx: 50, cy: 90 },
            { cx: 10, cy: 70 },
            { cx: 10, cy: 30 }
          ].map((pos, i) => (
            <circle key={i} cx={pos.cx} cy={pos.cy} r="5" fill="#10b981" />
          ))}
        </svg>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute waving-particle rounded-full"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            background: ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3 + 0.1,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 5}s`
          }}
        />
      ))}

      {/* Flask Icon */}
      <div className="absolute top-16 right-1/3 floating-atom opacity-20" style={{ animationDelay: '2s' }}>
        <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
          <path d="M15 5 L15 20 L5 50 Q3 55 8 58 L42 58 Q47 55 45 50 L35 20 L35 5" stroke="#0ea5e9" strokeWidth="2" fill="none" />
          <line x1="12" y1="5" x2="38" y2="5" stroke="#0ea5e9" strokeWidth="2" />
          <ellipse cx="25" cy="45" rx="12" ry="5" fill="#0ea5e940" />
        </svg>
      </div>

      {/* Microscope Icon */}
      <div className="absolute bottom-1/3 left-16 floating-atom opacity-20" style={{ animationDelay: '4s' }}>
        <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
          <circle cx="25" cy="15" r="10" stroke="#8b5cf6" strokeWidth="2" fill="none" />
          <line x1="25" y1="25" x2="25" y2="45" stroke="#8b5cf6" strokeWidth="3" />
          <line x1="15" y1="55" x2="35" y2="55" stroke="#8b5cf6" strokeWidth="3" />
          <line x1="25" y1="45" x2="25" y2="55" stroke="#8b5cf6" strokeWidth="3" />
          <circle cx="25" cy="15" r="4" fill="#8b5cf640" />
        </svg>
      </div>
    </div>
  )

  // Input Field Component with Icon
  const InputField = ({ icon, label, required, ...props }) => (
    <div className="space-y-1">
      <label className="field-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className="input-wrapper">
        <span className="input-icon">{icon}</span>
        <input className="form-input" {...props} required={required} />
      </div>
    </div>
  )

  // Select Field Component with Icon
  const SelectField = ({ icon, label, required, children, ...props }) => (
    <div className="space-y-1">
      <label className="field-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className="input-wrapper">
        <span className="input-icon">{icon}</span>
        <select className="form-input" {...props} required={required}>
          {children}
        </select>
      </div>
    </div>
  )

  // Icons
  const Icons = {
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    gender: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    location: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    globe: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    building: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
        <path d="M10 6h4"></path>
        <path d="M10 10h4"></path>
        <path d="M10 14h4"></path>
        <path d="M10 18h4"></path>
      </svg>
    ),
    briefcase: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    email: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
    link: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    ),
    science: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v2H9z"></path>
        <path d="M10 5v4.5L6.5 15H6a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4h-.5L14 9.5V5"></path>
        <circle cx="10" cy="15" r="1"></circle>
        <circle cx="14" cy="13" r="1"></circle>
      </svg>
    ),
    target: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    clock: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
    database: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    award: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
      </svg>
    ),
    book: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    lightbulb: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
      </svg>
    ),
  }

  const renderRoleFields = () => {
    switch (role) {
      case "Researcher":
        return (
          <>
            <InputField
              icon={Icons.science}
              label="Primary Research Domain"
              required
              type="text"
              name="primaryResearchDomain"
              placeholder="e.g., Computational Biology, Quantum Physics"
              value={formData.primaryResearchDomain || ""}
              onChange={handleInputChange}
            />

            <InputField
              icon={Icons.clock}
              label="Years of Experience"
              required
              type="number"
              name="yearsOfExperience"
              placeholder="e.g., 5"
              min="0"
              max="70"
              value={formData.yearsOfExperience || ""}
              onChange={handleInputChange}
            />

            <SelectField
              icon={Icons.target}
              label="Research Focus"
              required
              name="researchFocus"
              value={formData.researchFocus || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select your research focus...</option>
              <option value="Theoretical">Theoretical Research</option>
              <option value="Applied">Applied Research</option>
              <option value="Exploratory">Exploratory Research</option>
              <option value="Fundamental">Fundamental Research</option>
            </SelectField>

            <InputField
              icon={Icons.book}
              label="Publications Count"
              required={false}
              type="number"
              name="publicationsCount"
              placeholder="e.g., 12"
              min="0"
              value={formData.publicationsCount || ""}
              onChange={handleInputChange}
            />

            <InputField
              icon={Icons.award}
              label="H-Index"
              required={false}
              type="number"
              name="hIndex"
              placeholder="e.g., 8"
              min="0"
              value={formData.hIndex || ""}
              onChange={handleInputChange}
            />

            <InputField
              icon={Icons.link}
              label="Google Scholar / ORCID Profile"
              required={false}
              type="text"
              name="scholarProfile"
              placeholder="e.g., https://scholar.google.com/..."
              value={formData.scholarProfile || ""}
              onChange={handleInputChange}
            />
          </>
        )

      case "R&D Engineer":
        return (
          <>
            <InputField
              icon={Icons.settings}
              label="Engineering Domain"
              required
              type="text"
              name="engineeringDomain"
              placeholder="e.g., Mechanical, Software, Biomedical"
              value={formData.engineeringDomain || ""}
              onChange={handleInputChange}
            />

            <InputField
              icon={Icons.building}
              label="Industry Sector"
              required
              type="text"
              name="industrySector"
              placeholder="e.g., Automotive, Aerospace, Healthcare"
              value={formData.industrySector || ""}
              onChange={handleInputChange}
            />

            <SelectField
              icon={Icons.target}
              label="Problem Type Preference"
              required
              name="problemTypePreference"
              value={formData.problemTypePreference || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select problem type...</option>
              <option value="Failure">Failure Analysis</option>
              <option value="Assumption">Assumption Testing</option>
              <option value="Hypothesis">Hypothesis Validation</option>
              <option value="Optimization">Process Optimization</option>
            </SelectField>

            <InputField
              icon={Icons.clock}
              label="Years in R&D"
              required
              type="number"
              name="yearsInRD"
              placeholder="e.g., 7"
              min="0"
              max="50"
              value={formData.yearsInRD || ""}
              onChange={handleInputChange}
            />

            <InputField
              icon={Icons.award}
              label="Patents Filed"
              required={false}
              type="number"
              name="patentsFiled"
              placeholder="e.g., 3"
              min="0"
              value={formData.patentsFiled || ""}
              onChange={handleInputChange}
            />

            <SelectField
              icon={Icons.lightbulb}
              label="Innovation Stage Preference"
              required={false}
              name="innovationStage"
              value={formData.innovationStage || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select stage...</option>
              <option value="Concept">Concept Development</option>
              <option value="Prototype">Prototyping</option>
              <option value="Testing">Testing & Validation</option>
              <option value="Production">Production Scale-up</option>
            </SelectField>
          </>
        )

      case "Scientist":
        return (
          <>
            <InputField
              icon={Icons.science}
              label="Scientific Discipline"
              required
              type="text"
              name="scientificDiscipline"
              placeholder="e.g., Molecular Biology, Organic Chemistry"
              value={formData.scientificDiscipline || ""}
              onChange={handleInputChange}
            />

            <InputField
              icon={Icons.building}
              label="Lab / Experimental Background"
              required={false}
              type="text"
              name="labBackground"
              placeholder="e.g., BSL-2 Lab, Clean Room Experience"
              value={formData.labBackground || ""}
              onChange={handleInputChange}
            />

            <SelectField
              icon={Icons.database}
              label="Research Approach"
              required
              name="dataPreference"
              value={formData.dataPreference || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select your approach...</option>
              <option value="Data-driven">Data-driven</option>
              <option value="Theory-driven">Theory-driven</option>
              <option value="Balanced">Balanced (Both)</option>
              <option value="Experimental">Experimental-first</option>
            </SelectField>

            <InputField
              icon={Icons.clock}
              label="Years in Scientific Research"
              required
              type="number"
              name="yearsInResearch"
              placeholder="e.g., 10"
              min="0"
              max="50"
              value={formData.yearsInResearch || ""}
              onChange={handleInputChange}
            />

            <SelectField
              icon={Icons.award}
              label="Highest Degree"
              required
              name="highestDegree"
              value={formData.highestDegree || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select degree...</option>
              <option value="Bachelor">Bachelor's Degree</option>
              <option value="Master">Master's Degree</option>
              <option value="PhD">Ph.D.</option>
              <option value="PostDoc">Post-Doctoral</option>
            </SelectField>

            <InputField
              icon={Icons.lightbulb}
              label="Key Research Interests"
              required={false}
              type="text"
              name="researchInterests"
              placeholder="e.g., CRISPR, Protein Folding, Nanomaterials"
              value={formData.researchInterests || ""}
              onChange={handleInputChange}
            />
          </>
        )

      case "Product Analyst":
        return (
          <>
            <InputField
              icon={Icons.briefcase}
              label="Product Domain"
              required
              type="text"
              name="productDomain"
              placeholder="e.g., SaaS, FinTech, E-commerce"
              value={formData.productDomain || ""}
              onChange={handleInputChange}
            />

            <SelectField
              icon={Icons.target}
              label="Research Goal"
              required
              name="researchGoal"
              value={formData.researchGoal || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select your goal...</option>
              <option value="Innovation">Innovation & Discovery</option>
              <option value="Risk">Risk Assessment</option>
              <option value="Validation">Market Validation</option>
              <option value="Optimization">Product Optimization</option>
            </SelectField>

            <SelectField
              icon={Icons.lightbulb}
              label="Output Preference"
              required
              name="outputPreference"
              value={formData.outputPreference || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select output type...</option>
              <option value="Actionable">Actionable Insights</option>
              <option value="Exploratory">Exploratory Findings</option>
              <option value="Evidence-based">Evidence-based Reports</option>
              <option value="Visual">Visual Dashboards</option>
            </SelectField>

            <InputField
              icon={Icons.clock}
              label="Years in Product Analysis"
              required
              type="number"
              name="yearsInAnalysis"
              placeholder="e.g., 4"
              min="0"
              max="40"
              value={formData.yearsInAnalysis || ""}
              onChange={handleInputChange}
            />

            <SelectField
              icon={Icons.database}
              label="Data Analysis Expertise"
              required={false}
              name="dataExpertise"
              value={formData.dataExpertise || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select expertise level...</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </SelectField>

            <InputField
              icon={Icons.settings}
              label="Preferred Analytics Tools"
              required={false}
              type="text"
              name="analyticsTools"
              placeholder="e.g., Mixpanel, Amplitude, SQL, Python"
              value={formData.analyticsTools || ""}
              onChange={handleInputChange}
            />
          </>
        )

      default:
        return null
    }
  }

  const getRoleIcon = () => {
    switch (role) {
      case "Researcher":
        return "🔬"
      case "R&D Engineer":
        return "⚙️"
      case "Scientist":
        return "🧪"
      case "Product Analyst":
        return "📊"
      default:
        return "👤"
    }
  }

  return (
    <div className="min-h-screen science-bg relative overflow-hidden">
      <style>{backgroundStyles}</style>
      
      <ScienceBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          
          {/* Header Card */}
          <div className="glass-card rounded-3xl shadow-2xl p-8 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">
                  {getRoleIcon()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                    Complete Your Profile
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Set up your research profile to get personalized insights
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Your Role:</span>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold shadow-lg">
                  {role}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Profile Completion</span>
                <span className="text-sm font-bold text-indigo-600">{calculateProgress()}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${calculateProgress()}%` }} />
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="glass-card rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit}>
              
              {/* Role Selection Section */}
              <div className="mb-8">
                <div className="section-divider">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs">0</span>
                    Professional Role
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {["Researcher", "R&D Engineer", "Scientist", "Product Analyst"].map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setRole(roleOption)}
                      className={`p-4 rounded-lg border-2 transition-all text-sm font-medium ${
                        role === roleOption
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md"
                          : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30"
                      }`}
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Personal Information Section */}
              <div className="mb-8">
                <div className="section-divider">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 flex items-center justify-center text-white text-xs">1</span>
                    Personal Information
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InputField
                    icon={Icons.user}
                    label="Full Name"
                    required
                    type="text"
                    name="fullName"
                    placeholder="e.g., Dr. Jane Smith"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                  />

                  <SelectField
                    icon={Icons.gender}
                    label="Gender"
                    required
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </SelectField>

                  <div className="space-y-1">
                    <label className="field-label">
                      Date of Birth<span className="required-star">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">{Icons.calendar}</span>
                      <input
                        className="form-input"
                        type="date"
                        name="dob"
                        value={formData.dob || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <InputField
                    icon={Icons.email}
                    label="Email Address"
                    required
                    type="email"
                    name="email"
                    placeholder="e.g., jane.smith@university.edu"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />

                  <InputField
                    icon={Icons.phone}
                    label="Phone Number"
                    required
                    type="tel"
                    name="phone"
                    placeholder="e.g., +1 (555) 123-4567"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                  />

                  <InputField
                    icon={Icons.link}
                    label="LinkedIn Profile"
                    required={false}
                    type="url"
                    name="linkedin"
                    placeholder="e.g., linkedin.com/in/janesmith"
                    value={formData.linkedin || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Location & Organization Section */}
              <div className="mb-8">
                <div className="section-divider">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs">2</span>
                    Location & Organization
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InputField
                    icon={Icons.location}
                    label="City"
                    required
                    type="text"
                    name="city"
                    placeholder="e.g., Cambridge"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                  />

                  <InputField
                    icon={Icons.globe}
                    label="Country"
                    required
                    type="text"
                    name="country"
                    placeholder="e.g., United States"
                    value={formData.country || ""}
                    onChange={handleInputChange}
                  />

                  <InputField
                    icon={Icons.location}
                    label="Timezone"
                    required={false}
                    type="text"
                    name="timezone"
                    placeholder="e.g., EST (UTC-5)"
                    value={formData.timezone || ""}
                    onChange={handleInputChange}
                  />

                  <InputField
                    icon={Icons.building}
                    label="Organization / Institution"
                    required={false}
                    type="text"
                    name="organization"
                    placeholder="e.g., MIT, Stanford University"
                    value={formData.organization || ""}
                    onChange={handleInputChange}
                  />

                  <InputField
                    icon={Icons.briefcase}
                    label="Department / Team"
                    required
                    type="text"
                    name="department"
                    placeholder="e.g., Computer Science, Biology Lab"
                    value={formData.department || ""}
                    onChange={handleInputChange}
                  />

                  <InputField
                    icon={Icons.award}
                    label="Current Position / Title"
                    required={false}
                    type="text"
                    name="position"
                    placeholder="e.g., Senior Researcher, Principal Scientist"
                    value={formData.position || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Role-Specific Section */}
              <div className="mb-8">
                <div className="section-divider">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs">3</span>
                    {role} Details
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderRoleFields()}
                </div>
              </div>

              {/* Bio & Interests Section */}
              <div className="mb-8">
                <div className="section-divider">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase tracking-wider">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs">4</span>
                    Bio & Preferences
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <label className="field-label">
                      Short Bio / About You
                    </label>
                    <div className="input-wrapper">
                      <textarea
                        className="form-input resize-none"
                        style={{ paddingLeft: '1rem', minHeight: '100px' }}
                        name="bio"
                        placeholder="e.g., I'm a computational biologist with 10+ years of experience in genomic data analysis. My research focuses on developing machine learning algorithms for drug discovery..."
                        value={formData.bio || ""}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      icon={Icons.lightbulb}
                      label="Key Skills / Expertise"
                      required={false}
                      type="text"
                      name="skills"
                      placeholder="e.g., Python, R, Machine Learning, Statistical Analysis"
                      value={formData.skills || ""}
                      onChange={handleInputChange}
                    />

                    <SelectField
                      icon={Icons.globe}
                      label="Preferred Language"
                      required={false}
                      name="preferredLanguage"
                      value={formData.preferredLanguage || ""}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select language...</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Other">Other</option>
                    </SelectField>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="submit-btn w-full h-14 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Your Profile...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Complete Profile & Continue
                  </>
                )}
              </button>

              {/* Footer Note */}
              <p className="text-center text-gray-400 text-sm mt-6">
                <span className="required-star">*</span> Required fields must be filled to continue
              </p>
            </form>
          </div>

          {/* Footer Tips */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🔒", title: "Secure", desc: "Your data is encrypted" },
              { icon: "✏️", title: "Editable", desc: "Update anytime" },
              { icon: "🎯", title: "Personalized", desc: "Better recommendations" }
            ].map((tip, i) => (
              <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <p className="font-semibold text-gray-700">{tip.title}</p>
                  <p className="text-sm text-gray-500">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}