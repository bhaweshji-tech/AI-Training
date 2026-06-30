import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 🔴 FIREBASE CONFIGURATION
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

// 🔴 ADMIN EMAIL
export const ADMIN_EMAIL = "bhaweshji@gmail.com";

// 🟢 SUPABASE CONFIGURATION
const SUPABASE_URL = "https://gsdblteofsongnjdjhpc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u9dNq32zPDAFOO415PArvQ_ljzEEiaC";

// Unified Supabase Client Initialization
export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 🎨 AUTOMATIC THEME DISTRIBUTION ENGINE
 * Fetches design tokens from your Supabase table and maps them to CSS custom variables.
 */
async function syncLiveThemeSettings() {
  try {
    const { data: settings, error } = await supabaseClient
      .from("theme_settings")
      .select("key, value");

    if (error) {
      console.warn("Theme synchronization offline, deploying fallbacks:", error.message);
      return;
    }

    if (settings && settings.length > 0) {
      const rootElement = document.documentElement;
      settings.forEach(setting => {
        // Dynamically inject variables directly into the browser window root
        rootElement.style.setProperty(`--${setting.key}`, setting.value);
      });
    }
  } catch (err) {
    console.error("Critical fault executing style synchronization:", err);
  }
}

// Fire theme updates immediately on script evaluation
syncLiveThemeSettings();
