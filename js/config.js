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

// 🔵 3. SUPABASE CONFIGURATION (Restored for Courses & Reviews)
const SUPABASE_URL = "https://gsdblteofsongnjdjhpc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u9dNq32zPDAFOO415PArvQ_ljzEEiaC";

// This exports the client your app.js requires to pull dashboard content
export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🟢 4. AUTOMATIC LIVE THEME ENGINE
/**
 * Triggers the secure cloud sync with Google Stitch via the Edge Function 
 * and maps all layout values (fonts, padding, dimensions, colors) instantly.
 */
async function syncLiveThemeSettings() {
  try {
    // 1. Tell your secure edge function to fetch the latest specs from Google Stitch
    await fetch("https://gsdblteofsongnjdjhpc.supabase.co/functions/v1/stitch-theme-receiver", {
      method: "POST"
    });

    // 2. Fetch the newly synchronized options from your public database table
    const { data: settings, error } = await supabaseClient
      .from("theme_settings")
      .select("key, value");

    if (error) throw error;

    if (settings && settings.length > 0) {
      const rootElement = document.documentElement;
      settings.forEach(setting => {
        // Apply everything (fonts, sizes, dimensions, padding, colors) instantly into global CSS
        rootElement.style.setProperty(`--${setting.key}`, setting.value);
      });
      console.log(`🚀 All design assets (${settings.length} tokens) synchronized live from Google Stitch!`);
    }
  } catch (err) {
    console.warn("Theme synchronization offline, deploying style.css fallbacks:", err.message);
  }
}

// Fire theme updates immediately on page load
syncLiveThemeSettings();
