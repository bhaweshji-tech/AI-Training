import { auth, provider, ADMIN_EMAIL } from "./config.js";
import { signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * Dynamically fetches external component HTML files and loads them into the DOM placeholders.
 * Replaces the old approach of embedding large UI structural layouts inside JS string parameters.
 */
export async function injectLayout(currentUser) {
  const headerPlaceholder = document.getElementById("shared-header");
  const footerPlaceholder = document.getElementById("shared-footer");

  // 1. Fetch and inject Header markup
  if (headerPlaceholder) {
    try {
      const response = await fetch("components/header.html");
      if (response.ok) {
        headerPlaceholder.innerHTML = await response.text();
        // Wire up interactivity once elements are appended to the DOM tree
        setupAuthUI(currentUser);
      } else {
        console.error("Failed to load header template file.");
      }
    } catch (err) {
      console.error("Error fetching header template component:", err);
    }
  }

  // 2. Fetch and inject Footer markup
  if (footerPlaceholder) {
    try {
      const response = await fetch("components/footer.html");
      if (response.ok) {
        footerPlaceholder.innerHTML = await response.text();
      } else {
        console.error("Failed to load footer template file.");
      }
    } catch (err) {
      console.error("Error fetching footer template component:", err);
    }
  }
}

/**
 * Manages visibility toggles and profile populates for the fetched header template elements
 */
function setupAuthUI(currentUser) {
  const loggedOutArea = document.getElementById("loggedOutArea");
  const loggedInArea = document.getElementById("loggedInArea");
  const loginBtn = document.getElementById("btn-login");
  const logoutBtn = document.getElementById("btn-logout");
  const userPhoto = document.getElementById("userPhoto");
  const userName = document.getElementById("userName");
  const dashboardLink = document.getElementById("dashboardLink");

  if (currentUser) {
    // Show user controls, hide login area
    if (loggedOutArea) loggedOutArea.classList.add("hidden");
    if (loggedInArea) loggedInArea.classList.remove("hidden");

    // Populate profile indicators
    if (userPhoto) userPhoto.src = currentUser.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150";
    if (userName) userName.textContent = currentUser.displayName || "User";

    // Set correct dashboard link location matching admin clearance rules
    if (dashboardLink) {
      dashboardLink.href = currentUser.email === ADMIN_EMAIL ? "admin.html" : "profile.html";
    }

    // Set up logout click triggers
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        signOut(auth).then(() => {
          window.location.href = "index.html";
        }).catch(err => alert("Logout failed: " + err.message));
      };
    }
  } else {
    // Show login option, hide authenticated user tools
    if (loggedInArea) loggedInArea.classList.add("hidden");
    if (loggedOutArea) loggedOutArea.classList.remove("hidden");

    // Set up login click triggers
    if (loginBtn) {
      loginBtn.onclick = () => {
        signInWithPopup(auth, provider).catch(err => alert("Login failed: " + err.message));
      };
    }
  }
}
