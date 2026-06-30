import { auth, supabaseClient } from "./config.js";
import { injectLayout } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let globalUser = null;

// Handle authentication lifecycle state changes
onAuthStateChanged(auth, (user) => {
  globalUser = user;
  // Inject the custom component structures asynchronously
  injectLayout(user);
  // Fetch data records and render cards
  loadDashboardData();
});

/**
 * Fetches course data and user reviews from Supabase, then dynamically builds the UI 
 * using the precise classes from the Stitch UI framework.
 */
async function loadDashboardData() {
  const statusEl = document.getElementById("status");
  const courseGrid = document.getElementById("courseGrid");
  
  if (!courseGrid) return;
  courseGrid.innerHTML = "";
  
  if (statusEl) statusEl.innerText = "FETCHING NEURAL DATA RECORDS...";

  // 1. Fetch Dynamic Courses from Supabase trainingdata table
  const { data: courses, error: courseErr } = await supabaseClient
    .from("trainingdata")
    .select("id, title, desc, tech, link")
    .order("id", { ascending: true });

  // 2. Fetch associated Visitor Reviews
  const { data: reviews, error: reviewErr } = await supabaseClient
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (courseErr) {
    if (statusEl) statusEl.innerText = "SYNC ERROR: " + courseErr.message;
    return;
  }
  
  if (!courses || courses.length === 0) {
    if (statusEl) statusEl.innerText = "NO PROTOCOLS FOUND.";
    return;
  }

  if (statusEl) statusEl.innerText = `ACTIVE SYSTEMS: ${courses.length} CHANNELS`;

  // 3. Dynamically build each card structure using Stitch design specifications
  courses.forEach(course => {
    const courseReviews = reviews ? reviews.filter(r => r.course_id === course.id) : [];
    const cardElement = document.createElement("div");
    
    // Applying the high-fidelity glass-panel and hover mechanics from Stitch design
    cardElement.className = "glass-panel rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group";

    // Setup color badge variables based on standard tech strings for visual contrast
    let techBadgeClass = "bg-violet-500/20 text-violet-400 border-violet-500/30";
    const techLower = (course.tech || "").toLowerCase();
    if (techLower.includes("supabase")) {
        techBadgeClass = "bg-blue-500/20 text-blue-400 border-blue-500/30";
    } else if (techLower.includes("ui") || techLower.includes("framework")) {
        techBadgeClass = "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    } else if (techLower.includes("api") || techLower.includes("openai")) {
        techBadgeClass = "bg-orange-500/20 text-orange-400 border-orange-500/30";
    }

    // Process review items sub-elements layout markup
    let reviewsHTML = courseReviews.map(r => `
      <div class="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs text-slate-300 mt-2">
        <div class="flex items-center space-x-2 mb-1">
          <img src="${r.user_photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'}" class="w-4 h-4 rounded-full border border-violet-500/30">
          <span class="font-bold text-slate-200">${r.user_name}</span>
        </div>
        <p class="italic text-slate-400">"${r.review_text}"</p>
      </div>
    `).join("");

    // Populate full inner card schema mapping structural references cleanly
    cardElement.innerHTML = `
      <div>
        <div class="flex justify-between items-start mb-4">
          <span class="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${techBadgeClass}">
            ${course.tech || "GENERAL"}
          </span>
          <a href="${course.link || "#"}" target="_blank" class="text-slate-500 hover:text-violet-400 transition" title="Visit Resource">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6
