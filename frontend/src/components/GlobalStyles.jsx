export default function GlobalStyles() {
  return (
    <style>{`
      /* Theme Variables */
      :root {
        --bg-primary: #ffffff;
        --bg-secondary: #f8fafc;
        --bg-tertiary: #f1f5f9;
        --text-primary: #1e293b;
        --text-secondary: #64748b;
        --text-tertiary: #94a3b8;
        --border-color: #e2e8f0;
        --glass-bg: rgba(255, 255, 255, 0.85);
      }

      :root.dark {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;
        --text-primary: #f1f5f9;
        --text-secondary: #cbd5e1;
        --text-tertiary: #94a3b8;
        --border-color: #334155;
        --glass-bg: rgba(15, 23, 42, 0.85);
      }

      /* Global Dark Mode Styles */
      :root.dark body {
        background-color: #0f172a;
        color: #f1f5f9;
      }

      :root.dark {
        background-color: #0f172a;
      }

      /* Comprehensive Text Color Updates */
      :root.dark h1, :root.dark h2, :root.dark h3, :root.dark h4, :root.dark h5, :root.dark h6 {
        color: #f1f5f9;
      }

      :root.dark p, :root.dark span, :root.dark div, :root.dark a {
        color: inherit;
      }

      /* Specific black text to white in dark mode */
      :root.dark .text-black {
        color: #f1f5f9;
      }

      :root.dark .text-white {
        color: #f1f5f9;
      }

      /* Input fields */
      :root.dark input[type="text"],
      :root.dark input[type="email"],
      :root.dark input[type="password"],
      :root.dark input[type="tel"],
      :root.dark input[type="url"],
      :root.dark input[type="date"],
      :root.dark textarea,
      :root.dark select {
        background-color: #1e293b;
        color: #f1f5f9;
        border-color: #334155;
      }

      :root.dark input[type="text"]::placeholder,
      :root.dark input[type="email"]::placeholder,
      :root.dark input[type="password"]::placeholder,
      :root.dark input[type="tel"]::placeholder,
      :root.dark input[type="url"]::placeholder,
      :root.dark textarea::placeholder {
        color: #64748b;
      }

      /* Buttons */
      :root.dark button {
        color: inherit;
      }

      /* Cards with glass effect */
      :root.dark .glass-card {
        background: rgba(30, 41, 59, 0.85);
        border-color: #334155;
      }

      /* Gradients in dark mode */
      :root.dark .bg-gradient-to-br,
      :root.dark .bg-gradient-to-r,
      :root.dark .bg-gradient-to-l {
        opacity: 0.9;
      }

      /* Dashboard background */
      :root.dark .dashboard-bg {
        background: linear-gradient(135deg, #0f172a 0%, #1a2f4a 30%, #0f172a 60%, #1a1f3a 100%);
      }

      /* Page background */
      :root.dark .page-bg {
        background: linear-gradient(135deg, #0f172a 0%, #1a2f4a 30%, #0f172a 60%, #1a1f3a 100%);
      }

      /* Science background */
      :root.dark .science-bg {
        background: linear-gradient(135deg, #0f172a 0%, #1a2f4a 30%, #0f172a 60%, #1a1f3a 100%);
      }

      /* Light backgrounds that need dark versions */
      :root.dark .bg-white,
      :root.dark .bg-gray-50,
      :root.dark .bg-blue-50,
      :root.dark .bg-sky-50,
      :root.dark .bg-indigo-50,
      :root.dark .bg-green-50,
      :root.dark .bg-red-50,
      :root.dark .bg-purple-50,
      :root.dark .bg-amber-50 {
        background-color: #1e293b;
      }

      :root.dark .border-gray-200,
      :root.dark .border-gray-100,
      :root.dark .border-gray-300 {
        border-color: #334155;
      }

      :root.dark .text-gray-800,
      :root.dark .text-gray-700 {
        color: #f1f5f9;
      }

      :root.dark .text-gray-600,
      :root.dark .text-gray-500 {
        color: #cbd5e1;
      }

      :root.dark .text-gray-400,
      :root.dark .text-gray-300 {
        color: #94a3b8;
      }

      /* SVG elements - ensure dark backgrounds for animations */
      :root.dark svg circle,
      :root.dark svg rect,
      :root.dark svg ellipse,
      :root.dark svg polygon {
        opacity: 0.7;
      }

      :root.dark svg line {
        stroke: #475569;
      }

      /* Background animation elements */
      :root.dark .floating-element,
      :root.dark .floating-element-reverse,
      :root.dark .orbiting,
      :root.dark .pulsing,
      :root.dark .drifting,
      :root.dark .molecule-spin {
        opacity: 0.5;
      }

      /* Grid pattern in dark mode */
      :root.dark [style*="backgroundImage"] {
        background-image: linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px) !important;
      }

      /* Shadow adjustments for dark mode */
      :root.dark .shadow-lg,
      :root.dark .shadow-xl,
      :root.dark .shadow-2xl,
      :root.dark .shadow-sm {
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      }

      /* Form fields styling */
      :root.dark .form-input {
        background: rgba(30, 41, 59, 0.9) !important;
        color: #f1f5f9 !important;
        border-color: #334155 !important;
      }

      :root.dark .form-input:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(59, 130, 246, 0.1) !important;
        background: #0f172a !important;
      }

      /* Hover states */
      :root.dark .hover\\:bg-white:hover {
        background-color: #1e293b;
      }

      :root.dark .hover\\:bg-gray-50:hover {
        background-color: #334155;
      }

      :root.dark .hover\\:bg-gray-100:hover {
        background-color: #334155;
      }

      :root.dark .hover\\:bg-red-50:hover {
        background-color: rgba(220, 38, 38, 0.1);
      }

      :root.dark .hover\\:text-gray-800:hover {
        color: #f1f5f9;
      }

      /* Option elements */
      :root.dark option {
        background-color: #1e293b;
        color: #f1f5f9;
      }

      /* Dividers */
      :root.dark hr {
        border-color: #334155;
      }

      :root.dark .border-t,
      :root.dark .border-b,
      :root.dark .border-l,
      :root.dark .border-r {
        border-color: #334155;
      }

      /* Placeholder styling */
      :root.dark .placeholder-gray-500::placeholder {
        color: #64748b;
      }

      /* Dropdown menus */
      :root.dark .profile-dropdown {
        background-color: #1e293b;
        border-color: #334155;
      }

      /* Glass sidebar */
      :root.dark .glass-sidebar {
        background: rgba(30, 41, 59, 0.85);
        border-color: #334155;
      }

      /* Sidebar items */
      :root.dark .sidebar-item {
        color: #f1f5f9;
      }

      :root.dark .sidebar-item:hover {
        background-color: rgba(100, 116, 139, 0.2);
      }

      :root.dark .sidebar-item.active {
        background-color: rgba(59, 130, 246, 0.2);
      }

      /* Specific color classes for dark mode */
      :root.dark .text-indigo-600 {
        color: #93c5fd;
      }

      :root.dark .text-sky-600 {
        color: #7dd3fc;
      }

      :root.dark .text-purple-600 {
        color: #d8b4fe;
      }

      :root.dark .text-green-600 {
        color: #86efac;
      }

      :root.dark .text-red-600 {
        color: #fca5a5;
      }

      :root.dark .text-amber-500 {
        color: #fcd34d;
      }

      /* Background overlays */
      :root.dark .bg-black\\/50 {
        background-color: rgba(0, 0, 0, 0.7);
      }

      /* ScrollBar styling */
      :root.dark ::-webkit-scrollbar {
        background-color: #1e293b;
      }

      :root.dark ::-webkit-scrollbar-thumb {
        background-color: #475569;
      }

      :root.dark ::-webkit-scrollbar-thumb:hover {
        background-color: #64748b;
      }
    `}</style>
  )
}
