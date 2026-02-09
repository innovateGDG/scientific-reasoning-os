import { useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import { getProfile, saveProfile } from "../Services/api"
import ThemeToggle from "../components/ThemeToggle"

// Styles
const pageStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }

  .floating {
    animation: float 8s ease-in-out infinite;
  }

  .page-bg {
    background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f5f3ff 100%);
    min-height: 100vh;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background: white;
  }

  .form-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .form-input:hover:not(:focus) {
    border-color: #cbd5e1;
  }

  select.form-input {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.25em 1.25em;
    padding-right: 2.5rem;
  }

  .field-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.375rem;
  }

  .required-star {
    color: #ef4444;
    margin-left: 2px;
  }
`

// Background
const BackgroundElements = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[
      { top: '15%', right: '10%', color: '#0ea5e9' },
      { top: '50%', right: '5%', color: '#8b5cf6' },
      { bottom: '20%', left: '8%', color: '#10b981' },
    ].map((item, i) => (
      <div
        key={i}
        className="absolute floating"
        style={{ top: item.top, bottom: item.bottom, left: item.left, right: item.right, animationDelay: `${i}s` }}
      >
        <div 
          className="w-3 h-3 rounded-full opacity-40"
          style={{ background: item.color }}
        />
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
  save: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  ),
  spinner: (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
    </svg>
  ),
}

// Input Component
const Input = ({ label, required, ...props }) => (
  <div>
    <label className="field-label">
      {label}
      {required && <span className="required-star">*</span>}
    </label>
    <input className="form-input" required={required} {...props} />
  </div>
)

// Select Component
const Select = ({ label, required, children, ...props }) => (
  <div>
    <label className="field-label">
      {label}
      {required && <span className="required-star">*</span>}
    </label>
    <select className="form-input" required={required} {...props}>
      {children}
    </select>
  </div>
)

// Textarea Component
const Textarea = ({ label, ...props }) => (
  <div>
    <label className="field-label">{label}</label>
    <textarea className="form-input resize-none" rows={4} {...props} />
  </div>
)

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login", { replace: true })
          return
        }

        const response = await getProfile()
        if (response.success && response.profile) {
          const p = response.profile
          setRole(p.role || "")
          setFormData({
            fullName: p.full_name || "",
            gender: p.gender || "",
            dob: p.dob || "",
            email: p.email || "",
            phone: p.phone || "",
            linkedin: p.linkedin || "",
            city: p.city || "",
            country: p.country || "",
            timezone: p.timezone || "",
            organization: p.organization || "",
            department: p.department || "",
            position: p.position || "",
            bio: p.bio || "",
            skills: p.skills || "",
            website: p.website || "",
            primaryResearchDomain: p.primary_research_domain || "",
            yearsOfExperience: p.years_of_experience || "",
            researchFocus: p.research_focus || "",
            publicationsCount: p.publications_count || "",
            hIndex: p.h_index || "",
            engineeringDomain: p.engineering_domain || "",
            industrySector: p.industry_sector || "",
            problemTypePreference: p.problem_type_preference || "",
            yearsInRD: p.years_in_rd || "",
            patentsFiled: p.patents_filed || "",
            innovationStage: p.innovation_stage || "",
            scientificDiscipline: p.scientific_discipline || "",
            labBackground: p.lab_background || "",
            dataPreference: p.data_preference || "",
            yearsInResearch: p.years_in_research || "",
            highestDegree: p.highest_degree || "",
            researchInterests: p.research_interests || "",
            productDomain: p.product_domain || "",
            researchGoal: p.research_goal || "",
            outputPreference: p.output_preference || "",
            yearsInAnalysis: p.years_in_analysis || "",
            dataExpertise: p.data_expertise || "",
            analyticsTools: p.analytics_tools || ""
          })
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load profile")
      } finally {
        setPageLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await saveProfile({ role, ...formData })
      if (res.success) {
        navigate("/profile", { replace: true })
      } else {
        setError(res.message || "Failed to save")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="page-bg flex items-center justify-center">
        <style>{pageStyles}</style>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Role-specific fields
  const renderRoleFields = () => {
    switch (role) {
      case "Researcher":
        return (
          <>
            <Input label="Research Domain" required name="primaryResearchDomain" placeholder="e.g., Machine Learning" value={formData.primaryResearchDomain || ""} onChange={handleChange} />
            <Input label="Years of Experience" required type="number" name="yearsOfExperience" placeholder="e.g., 5" min="0" value={formData.yearsOfExperience || ""} onChange={handleChange} />
            <Select label="Research Focus" required name="researchFocus" value={formData.researchFocus || ""} onChange={handleChange}>
              <option value="" disabled>Select focus...</option>
              <option value="Theoretical">Theoretical</option>
              <option value="Applied">Applied</option>
              <option value="Exploratory">Exploratory</option>
              <option value="Fundamental">Fundamental</option>
            </Select>
            <Input label="Publications Count" type="number" name="publicationsCount" placeholder="e.g., 12" min="0" value={formData.publicationsCount || ""} onChange={handleChange} />
            <Input label="H-Index" type="number" name="hIndex" placeholder="e.g., 8" min="0" value={formData.hIndex || ""} onChange={handleChange} />
          </>
        )
      case "R&D Engineer":
        return (
          <>
            <Input label="Engineering Domain" required name="engineeringDomain" placeholder="e.g., Software, Mechanical" value={formData.engineeringDomain || ""} onChange={handleChange} />
            <Input label="Industry Sector" required name="industrySector" placeholder="e.g., Automotive, Healthcare" value={formData.industrySector || ""} onChange={handleChange} />
            <Input label="Years in R&D" required type="number" name="yearsInRD" placeholder="e.g., 7" min="0" value={formData.yearsInRD || ""} onChange={handleChange} />
            <Select label="Problem Type" required name="problemTypePreference" value={formData.problemTypePreference || ""} onChange={handleChange}>
              <option value="" disabled>Select type...</option>
              <option value="Failure">Failure Analysis</option>
              <option value="Assumption">Assumption Testing</option>
              <option value="Hypothesis">Hypothesis Validation</option>
              <option value="Optimization">Optimization</option>
            </Select>
            <Input label="Patents Filed" type="number" name="patentsFiled" placeholder="e.g., 3" min="0" value={formData.patentsFiled || ""} onChange={handleChange} />
            <Select label="Innovation Stage" name="innovationStage" value={formData.innovationStage || ""} onChange={handleChange}>
              <option value="" disabled>Select stage...</option>
              <option value="Concept">Concept</option>
              <option value="Prototype">Prototype</option>
              <option value="Testing">Testing</option>
              <option value="Production">Production</option>
            </Select>
          </>
        )
      case "Scientist":
        return (
          <>
            <Input label="Scientific Discipline" required name="scientificDiscipline" placeholder="e.g., Molecular Biology" value={formData.scientificDiscipline || ""} onChange={handleChange} />
            <Input label="Lab Background" name="labBackground" placeholder="e.g., BSL-2 Lab" value={formData.labBackground || ""} onChange={handleChange} />
            <Input label="Years in Research" required type="number" name="yearsInResearch" placeholder="e.g., 10" min="0" value={formData.yearsInResearch || ""} onChange={handleChange} />
            <Select label="Research Approach" required name="dataPreference" value={formData.dataPreference || ""} onChange={handleChange}>
              <option value="" disabled>Select approach...</option>
              <option value="Data-driven">Data-driven</option>
              <option value="Theory-driven">Theory-driven</option>
              <option value="Balanced">Balanced</option>
              <option value="Experimental">Experimental</option>
            </Select>
            <Select label="Highest Degree" required name="highestDegree" value={formData.highestDegree || ""} onChange={handleChange}>
              <option value="" disabled>Select degree...</option>
              <option value="Bachelor">Bachelor's</option>
              <option value="Master">Master's</option>
              <option value="PhD">Ph.D.</option>
              <option value="PostDoc">Post-Doctoral</option>
            </Select>
            <Input label="Research Interests" name="researchInterests" placeholder="e.g., CRISPR, Genomics" value={formData.researchInterests || ""} onChange={handleChange} />
          </>
        )
      case "Product Analyst":
        return (
          <>
            <Input label="Product Domain" required name="productDomain" placeholder="e.g., SaaS, FinTech" value={formData.productDomain || ""} onChange={handleChange} />
            <Input label="Years in Analysis" required type="number" name="yearsInAnalysis" placeholder="e.g., 4" min="0" value={formData.yearsInAnalysis || ""} onChange={handleChange} />
            <Select label="Research Goal" required name="researchGoal" value={formData.researchGoal || ""} onChange={handleChange}>
              <option value="" disabled>Select goal...</option>
              <option value="Innovation">Innovation</option>
              <option value="Risk">Risk Assessment</option>
              <option value="Validation">Validation</option>
              <option value="Optimization">Optimization</option>
            </Select>
            <Select label="Output Preference" required name="outputPreference" value={formData.outputPreference || ""} onChange={handleChange}>
              <option value="" disabled>Select type...</option>
              <option value="Actionable">Actionable Insights</option>
              <option value="Exploratory">Exploratory</option>
              <option value="Evidence-based">Evidence-based</option>
              <option value="Visual">Visual</option>
            </Select>
            <Select label="Data Expertise" name="dataExpertise" value={formData.dataExpertise || ""} onChange={handleChange}>
              <option value="" disabled>Select level...</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </Select>
            <Input label="Analytics Tools" name="analyticsTools" placeholder="e.g., SQL, Python, Mixpanel" value={formData.analyticsTools || ""} onChange={handleChange} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="page-bg py-8 px-4">
      <style>{pageStyles}</style>
      <BackgroundElements />

      {/* THEME TOGGLE */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {Icons.back}
            <span className="font-medium">Cancel</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
          <div className="w-20" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl shadow-lg overflow-hidden animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          
          {/* Role Badge */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <p className="text-white/70 text-sm">Your Role</p>
            <p className="text-white text-lg font-bold">{role}</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" required name="fullName" placeholder="Dr. Jane Smith" value={formData.fullName || ""} onChange={handleChange} />
                <Select label="Gender" required name="gender" value={formData.gender || ""} onChange={handleChange}>
                  <option value="" disabled>Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </Select>
                <Input label="Date of Birth" required type="date" name="dob" value={formData.dob || ""} onChange={handleChange} />
                <Input label="Email" required type="email" name="email" placeholder="jane@example.com" value={formData.email || ""} onChange={handleChange} />
                <Input label="Phone" required type="tel" name="phone" placeholder="+1 555 123 4567" value={formData.phone || ""} onChange={handleChange} />
                <Input label="LinkedIn" name="linkedin" placeholder="linkedin.com/in/janesmith" value={formData.linkedin || ""} onChange={handleChange} />
              </div>
            </section>

            {/* Location & Organization */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Location & Organization</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="City" required name="city" placeholder="Cambridge" value={formData.city || ""} onChange={handleChange} />
                <Input label="Country" required name="country" placeholder="United States" value={formData.country || ""} onChange={handleChange} />
                <Input label="Timezone" name="timezone" placeholder="EST (UTC-5)" value={formData.timezone || ""} onChange={handleChange} />
                <Input label="Organization" name="organization" placeholder="MIT, Stanford" value={formData.organization || ""} onChange={handleChange} />
                <Input label="Department" required name="department" placeholder="Computer Science" value={formData.department || ""} onChange={handleChange} />
                <Input label="Position" name="position" placeholder="Senior Researcher" value={formData.position || ""} onChange={handleChange} />
              </div>
            </section>

            {/* Role-Specific Fields */}
            {role && (
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">{role} Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderRoleFields()}
                </div>
              </section>
            )}

            {/* Bio & Additional */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Additional Information</h2>
              <div className="space-y-4">
                <Textarea label="Bio" name="bio" placeholder="Tell us about yourself and your research interests..." value={formData.bio || ""} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Skills" name="skills" placeholder="Python, R, Machine Learning" value={formData.skills || ""} onChange={handleChange} />
                  <Input label="Website" name="website" placeholder="https://yourwebsite.com" value={formData.website || ""} onChange={handleChange} />
                </div>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? Icons.spinner : Icons.save}
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
      </div>
    </div>
  )
}