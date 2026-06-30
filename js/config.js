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

// 🔵 3. SUPABASE CONFIGURATION (Publicly Safe Keys)
const SUPABASE_URL = "https://gsdblteofsongnjdjhpc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u9dNq32zPDAFOO415PArvQ_ljzEEiaC";

export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 🎨 SECURE THEME DISTRIBUTION ENGINE
 * Reads design tokens from your public Supabase table.
 * The private Stitch API key remains safely hidden on the server side!
 */
async function syncLiveThemeSettings() {
  try {
    const { data: settings, error } = await supabaseClient
      .from("theme_settings")
      .select("key, value");

    if (error) throw error;

    if (settings && settings.length > 0) {
      const rootElement = document.documentElement;
      settings.forEach(setting => {
        rootElement.style.setProperty(`--${setting.key}`, setting.value);
      });
    }
  } catch (err) {
    console.warn("Theme synchronization offline, deploying style.css fallbacks:", err.message);
  }
}

// Fire theme updates immediately on load
syncLiveThemeSettings();
