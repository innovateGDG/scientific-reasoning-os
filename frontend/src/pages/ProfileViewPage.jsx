import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile } from "../Services/api"
import ThemeToggle from "../components/ThemeToggle"

// Styles
const pageStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(3deg); }
  }

  @keyframes orbit {
    0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .floating {
    animation: float 8s ease-in-out infinite;
  }

  .orbiting {
    animation: orbit 4s linear infinite;
  }

  .pulsing {
    animation: pulse 3s ease-in-out infinite;
  }

  .page-bg {
    background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f5f3ff 100%);
    min-height: 100vh;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .info-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .info-card:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`

// Background Component
const BackgroundElements = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Floating Molecules */}
    {[
      { top: '10%', right: '10%', delay: '0s', color: '#0ea5e9' },
      { top: '60%', right: '15%', delay: '2s', color: '#8b5cf6' },
      { bottom: '20%', left: '10%', delay: '1s', color: '#10b981' },
      { top: '30%', left: '5%', delay: '3s', color: '#f59e0b' },
    ].map((item, i) => (
      <div
        key={i}
        className="absolute floating"
        style={{ top: item.top, bottom: item.bottom, left: item.left, right: item.right, animationDelay: item.delay }}
      >
        <div className="relative w-12 h-12">
          <div 
            className="absolute w-4 h-4 rounded-full pulsing"
            style={{ background: item.color, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
          <div 
            className="absolute w-2 h-2 rounded-full orbiting"
            style={{ background: `${item.color}80`, top: '50%', left: '50%' }}
          />
          <div 
            className="absolute w-10 h-10 rounded-full border opacity-20"
            style={{ borderColor: item.color, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>
    ))}
  </div>
)

// Icons
const Icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  location: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  briefcase: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  flask: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v2H9z"/>
      <path d="M10 5v4.5L6.5 15H6a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4h-.5L14 9.5V5"/>
    </svg>
  ),
  alert: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
}

export default function ProfileViewPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login", { replace: true })
          return
        }

        const response = await getProfile()
        if (response.success) {
          setProfile(response.profile)
        } else {
          setError(response.message || "Failed to fetch profile")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  // Get role-specific fields
  const getRoleFields = () => {
    if (!profile) return []
    
    switch (profile.role) {
      case "Researcher":
        return [
          { label: "Research Domain", value: profile.primary_research_domain },
          { label: "Years of Experience", value: profile.years_of_experience },
          { label: "Research Focus", value: profile.research_focus },
          { label: "Publications", value: profile.publications_count },
          { label: "H-Index", value: profile.h_index },
        ]
      case "R&D Engineer":
        return [
          { label: "Engineering Domain", value: profile.engineering_domain },
          { label: "Industry Sector", value: profile.industry_sector },
          { label: "Years in R&D", value: profile.years_in_rd },
          { label: "Problem Type", value: profile.problem_type_preference },
          { label: "Patents Filed", value: profile.patents_filed },
          { label: "Innovation Stage", value: profile.innovation_stage },
        ]
      case "Scientist":
        return [
          { label: "Discipline", value: profile.scientific_discipline },
          { label: "Lab Background", value: profile.lab_background },
          { label: "Research Approach", value: profile.data_preference },
          { label: "Years in Research", value: profile.years_in_research },
          { label: "Highest Degree", value: profile.highest_degree },
          { label: "Research Interests", value: profile.research_interests },
        ]
      case "Product Analyst":
        return [
          { label: "Product Domain", value: profile.product_domain },
          { label: "Research Goal", value: profile.research_goal },
          { label: "Output Preference", value: profile.output_preference },
          { label: "Years in Analysis", value: profile.years_in_analysis },
          { label: "Data Expertise", value: profile.data_expertise },
          { label: "Analytics Tools", value: profile.analytics_tools },
        ]
      default:
        return []
    }
  }

  // Info Item Component - only renders if value exists
  const InfoItem = ({ label, value, isLink = false }) => {
    if (!value && value !== 0) return null
    
    return (
      <div className="info-card rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        {isLink ? (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 font-medium break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-gray-800 font-medium">{value}</p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page-bg flex items-center justify-center">
        <style>{pageStyles}</style>
        <BackgroundElements />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="page-bg flex items-center justify-center px-4">
        <style>{pageStyles}</style>
        <BackgroundElements />
        <div className="glass-card rounded-2xl p-8 max-w-md text-center relative z-10">
          <div className="text-red-400 mb-4 flex justify-center">{Icons.alert}</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Profile Error</h1>
          <p className="text-gray-600 mb-6">{error || "Profile not found"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const personalFields = [
    { label: "Full Name", value: profile.full_name },
    { label: "Email", value: profile.email },
    { label: "Phone", value: profile.phone },
    { label: "Gender", value: profile.gender },
    { label: "Date of Birth", value: formatDate(profile.dob) },
    { label: "LinkedIn", value: profile.linkedin, isLink: true },
  ]

  const locationFields = [
    { label: "City", value: profile.city },
    { label: "Country", value: profile.country },
    { label: "Timezone", value: profile.timezone },
    { label: "Organization", value: profile.organization },
    { label: "Department", value: profile.department },
    { label: "Position", value: profile.position },
  ]

  const roleFields = getRoleFields()

  // Filter out empty fields
  const hasPersonalInfo = personalFields.some(f => f.value)
  const hasLocationInfo = locationFields.some(f => f.value)
  const hasRoleInfo = roleFields.some(f => f.value)

  return (
    <div className="page-bg py-8 px-4">
      <style>{pageStyles}</style>
      <BackgroundElements />

      {/* THEME TOGGLE */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {Icons.back}
            <span className="font-medium">Back</span>
          </button>
          <button
            onClick={() => navigate("/profile/edit")}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            {Icons.edit}
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="glass-card rounded-2xl overflow-hidden animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 p-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile.full_name?.charAt(0) || "U"}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{profile.full_name || "User"}</h1>
                <p className="text-white/80 mt-1">{profile.role}</p>
                {profile.email && <p className="text-white/60 text-sm mt-1">{profile.email}</p>}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Bio */}
            {profile.bio && (
              <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-indigo-600">{Icons.user}</span>
                  About
                </h2>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              </div>
            )}

            {/* Personal Information */}
            {hasPersonalInfo && (
              <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-sky-600">{Icons.user}</span>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personalFields.map((field, i) => (
                    <InfoItem key={i} label={field.label} value={field.value} isLink={field.isLink} />
                  ))}
                </div>
              </div>
            )}

            {/* Location & Organization */}
            {hasLocationInfo && (
              <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-emerald-600">{Icons.location}</span>
                  Location & Organization
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {locationFields.map((field, i) => (
                    <InfoItem key={i} label={field.label} value={field.value} />
                  ))}
                </div>
              </div>
            )}

            {/* Role-Specific Information */}
            {hasRoleInfo && (
              <div className="animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-purple-600">{Icons.flask}</span>
                  {profile.role} Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roleFields.map((field, i) => (
                    <InfoItem key={i} label={field.label} value={field.value} />
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Website */}
            {(profile.skills || profile.website) && (
              <div className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-amber-600">{Icons.briefcase}</span>
                  Skills & Links
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem label="Skills" value={profile.skills} />
                  <InfoItem label="Website" value={profile.website} isLink />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}