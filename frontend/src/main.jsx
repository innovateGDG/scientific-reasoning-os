import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { GoogleOAuthProvider } from "@react-oauth/google"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="743371297786-1ff7kn430d022d0im7lnrm6cjapciosp.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)