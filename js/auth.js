import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 🔴 YOUR FIREBASE CONFIG
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
const provider = new GoogleAuthProvider();

// 🔴 YOUR ADMIN EMAIL
export const ADMIN_EMAIL = "bhaweshji@gmail.com";

const SUPABASE_URL = "https://gsdblteofsongnjdjhpc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u9dNq32zPDAFOO415PArvQ_ljzEEiaC";

// Single standard client used by everyone
export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function injectLayout(currentUser) {
  const headerHTML = `
    <nav class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <a href="index.html" class="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          AI-Training Portal
        </a>
      </div>
      <div id="auth-zone" class="flex items-center space-x-4">
        ${currentUser ? `
          <div class="flex items-center space-x-3">
            <img src="${currentUser.photoURL}" alt="Profile" class="w-8 h-8 rounded-full border border-blue-500">
            <span class="text-sm font-medium text-slate-200">${currentUser.displayName}</span>
            <a href="${currentUser.email === ADMIN_EMAIL ? 'admin.html' : 'profile.html'}" class="text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-blue-400 hover:bg-slate-700 transition">Dashboard</a>
            <button id="btn-logout" class="text-xs bg-red-950/40 text-red-400 border border-red-900/30 px-3 py-1.5 rounded-lg hover:bg-red-900/40 transition">Logout</button>
          </div>
        ` : `
          <button id="btn-login" class="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-950">
            <span>Login with Google</span>
          </button>
        `}
      </div>
    </nav>
  `;
  
  const headerEl = document.getElementById("shared-header");
  if (headerEl) headerEl.innerHTML = headerHTML;

  const footerHTML = `<div class="max-w-7xl mx-auto px-6 text-center text-sm text-slate-600">&copy; 2026 AI-Training Portal. All rights reserved.</div>`;
  const footerEl = document.getElementById("shared-footer");
  if (footerEl) footerEl.innerHTML = footerHTML;

  const loginBtn = document.getElementById("btn-login");
  if (loginBtn) loginBtn.addEventListener("click", () => signInWithPopup(auth, provider).catch(err => alert(err.message)));

  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) logoutBtn.addEventListener("click", () => signOut(auth).then(() => { window.location.href = "index.html"; }));
}
