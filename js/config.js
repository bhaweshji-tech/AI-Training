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

// 🔵 3. SUPABASE CONFIGURATION
const SUPABASE_URL = "https://gsdblteofsongnjdjhpc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u9dNq32zPDAFOO415PArvQ_ljzEEiaC";

export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🟢 4. RUNTIME THEME INJECTION
async function applySavedTheme() {
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
      console.log("🎨 Active theme variables successfully injected from database.");
    }
  } catch (err) {
    console.warn("Theme offline, using css defaults:", err.message);
  }
}

applySavedTheme();
