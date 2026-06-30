import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 🔴 1. FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyBnDBFx2UXRVIl-XnXZojPq00qIZuFX830",
  authDomain: "myaitraining-4326a.firebaseapp.com",
  projectId: "myaitraining-4326a",
  storageBucket: "myaitraining-4326a.firebasestorage.app",
  messagingSenderId: "451753280099",
  appId: "1:451753280099:web:8f0d5a873875bdbe4e2e56",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 🔴 2. GLOBAL ACCESS RULES
export const ADMIN_EMAIL = "bhaweshji@gmail.com";

// 🟢 3. GOOGLE STITCH AUTOMATION CONFIGURATION
// This key securely connects your live web application to your layout design dashboard
const STITCH_API_KEY = "sb_publishable_u9dNq32zPDAFOO415PArvQ_ljzEEiaC"; 

/**
 * 🎨 AUTOMATIC THEME ENGINE
 * Fetches active design system attributes (Fonts, Colors, Spacing, Card metrics) 
 * directly from your Google Stitch workspace and maps them to live CSS properties.
 */
async function pullLiveStitchTheme() {
  try {
    const response = await fetch("https://stitch.withgoogle.com/api/v1/themes/active", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${STITCH_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error(`Stitch connection timed out: ${response.statusText}`);

    const themeData = await response.json();
    
    // Normalize nested dictionary variations (handles custom token arrays or raw maps)
    const designTokens = themeData.tokens || themeData.styles || themeData.colors || themeData;
    const rootElement = document.documentElement;

    // Loop through every single structural token emitted by Google Stitch
    Object.entries(designTokens).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number") {
        const cleanCSSKey = key.trim().toLowerCase();
        
        // Dynamically inject variables directly into the browser's engine memory
        rootElement.style.setProperty(`--${cleanCSSKey}`, String(value).trim());
      }
    });

    console.log("🚀 Custom theme assets successfully synced live from Google Stitch!");
  } catch (error) {
    // Graceful error handling: falls back smoothly to the baseline hardcoded options in style.css
    console.warn("Deploying stylesheet fallbacks. Stitch Sync Alert:", error.message);
  }
}

// Fire style configuration check immediately on page generation
pullLiveStitchTheme();
