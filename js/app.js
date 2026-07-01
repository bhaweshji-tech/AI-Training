import { auth, supabaseClient } from "./config.js";
import { injectLayout } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let globalUser = null;

// Handle authentication lifecycle state changes
onAuthStateChanged(auth, (user) => {
  globalUser = user;
  // Inject the custom component structures asynchronously
  injectLayout(user);
  
  // 1. Fetch and inject dynamic Stitch layout styling rows first (Bypassing network caches)
  applyDynamicThemeSettings();
  
  // 2. Fetch data records and render cards
  loadDashboardData();
});

/**
 * Fetches design properties from 'theme_settings' table and applies them row-by-row
 */
async function applyDynamicThemeSettings() {
  try {
    // Force a fresh network fetch by appending a dynamic cache control flag
    const { data: settings, error } = await supabaseClient
      .from("theme_settings")
      .select("key, value")
      .headers({ "cache-control": "no-cache, no-store, must-revalidate" });

    if (error) throw error;
    if (!settings || settings.length === 0) return;

    // Loop through every design property row stored in your database
    settings.forEach((setting) => {
      if (setting.key === "admin_auth_token") return;

      // Rule A: Inject custom properties directly into document CSS variables
      document.documentElement.style.setProperty(`--${setting.key}`, setting.value);

      // Rule B: Fallback mapping if keys match global layout elements directly
      if (['background-color', 'background-image', 'font-family', 'color'].includes(setting.key)) {
        document.body.style[setting.key] = setting.value;
      }

      // Rule C: Direct layout element ID injection mapping fallback
      const specificElement = document.getElementById(setting.key);
      if (specificElement) {
        specificElement.style.cssText = setting.value;
      }
    });

    console.log(`🎨 Theme engine initialized: Cache bypassed. ${settings.length - 1} styles applied.`);
  } catch (err) {
    console.error("Theme Engine Loading Exception:", err.message);
  }
}

/**
 * Fetches course data and user reviews from Supabase, then dynamically builds the UI 
 * using standard Tailwind classes matching the Developer Edition design.
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

  if (statusEl) statusEl.innerText = `LEARNING PATH: ${courses.length} COURSES`;

  // 3. Dynamically build each card structure using standard Tailwind layout classes
  courses.forEach((course) => {
    const courseReviews = reviews ? reviews.filter(r => r.course_id === course.id) : [];
    const cardElement = document.createElement("div");
    
    cardElement.className = "glass-panel rounded-xl shadow-2xl flex flex-col overflow-hidden group cursor-pointer card-hover text-left";

    let reviewsHTML = courseReviews.map(r => `
      <div class="bg-black/40 p-3 rounded border border-white/5 text-xs text-slate-300 mt-2">
        <div class="flex items-center space-x-2 mb-1">
          <img src="${r.user_photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'}" class="w-4 h-4 rounded-full border border-rose-600/40">
          <span class="font-bold text-slate-200">${r.user_name}</span>
        </div>
        <p class="italic text-white/70">"${r.review_text}"</p>
      </div>
    `).join("");

    cardElement.innerHTML = `
      <div class="p-6 flex-grow flex flex-col">
        <div class="flex justify-between items-start mb-4">
          <span class="px-2 py-1 bg-rose-600 text-white text-[10px] rounded tracking-widest font-bold uppercase shadow-[0_0_10px_rgba(225,29,72,0.4)]">
            ${course.tech || "GENERAL"}
          </span>
          <button class="text-white/40 hover:text-rose-400 transition-colors">
            <span class="material-symbols-outlined">bookmark_add</span>
          </button>
        </div>
        
        <h3 class="text-xl font-bold font-[Geist] text-white mb-4 group-hover:text-rose-400 transition-all duration-300 uppercase tracking-tight">
          ${course.title || "UNTITLED PIPELINE"}
        </h3>
        
        <div class="p-4 rounded bg-[#2a1b1b]/60 border border-white/5 mb-4">
          <p class="text-sm font-[Inter] text-white/90 leading-relaxed line-clamp-3">
            ${course.desc || "No calibration metrics provided for this network module."}
          </p>
        </div>

        <div class="mt-4 border-t border-white/5 pt-4">
          <span class="text-[10px] font-bold font-[Geist] tracking-widest text-white/40 uppercase">Diagnostic Logs (${courseReviews.length})</span>
          <div class="space-y-1 max-h-32 overflow-y-auto mt-2 pr-1 custom-scrollbar">
            ${reviewsHTML || '<p class="text-xs text-white/30 italic">No logs submitted.</p>'}
          </div>
        </div>
      </div>

      <div class="p-4 bg-rose-600 flex flex-col gap-3 mt-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <div class="flex text-[16px] text-white">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bolt</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bolt</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bolt</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bolt</span>
              <span class="material-symbols-outlined">bolt</span>
            </div>
          </div>
          <a href="${course.link || "#"}" target="_blank" class="text-xs font-bold font-[Geist] group-hover:translate-x-1 transition-transform uppercase tracking-widest text-white flex items-center gap-1">
            View <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

        ${globalUser ? `
          <div class="pt-2 border-t border-white/20 mt-1">
            <div class="flex gap-2">
              <input type="text" id="input-${course.id}" placeholder="Append diagnostic entry..." 
                     class="bg-black/40 border border-white/10 text-xs rounded px-3 py-1.5 flex-grow focus:outline-none focus:border-white text-white placeholder-white/40">
              <button data-course-id="${course.id}" class="btn-submit-review px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white text-xs font-bold font-[Geist] rounded uppercase tracking-widest border border-white/10 transition-colors">
                Post
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    courseGrid.appendChild(cardElement);
  });

  // Attach dynamic form submission listeners to interface node items
  document.querySelectorAll(".btn-submit-review").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const targetBtn = e.currentTarget;
      const cid = targetBtn.getAttribute("data-course-id");
      const inputField = document.getElementById(`input-${cid}`);
      const reviewTextStr = inputField ? inputField.value.trim() : "";

      if (!reviewTextStr) return;

      const { error } = await supabaseClient.from("reviews").insert([{
        course_id: parseInt(cid),
        user_email: globalUser.email,
        user_name: globalUser.displayName,
        user_photo: globalUser.photoURL,
        review_text: reviewTextStr
      }]);

      if (error) {
        alert("Transmission Failed: " + error.message);
      } else {
        inputField.value = "";
        loadDashboardData(); // Instantly refresh data UI state
      }
    });
  });
}

/**
 * ============================================================================
 * BACKGROUND GL ENGINE: INITIALIZE STITCH EMITTED PARTICLES SHADER ENGINE
 * ============================================================================
 */
function initBackgroundEngine() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const vertexSource = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
          v_texCoord = position * 0.5 + 0.5;
          v_texCoord.y = 1.0 - v_texCoord.y;
          gl_Position = vec4(position, 0.0, 1.0);
      }
  `;

  const fragmentSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 mouse = u_mouse / u_resolution;
          vec3 color1 = vec3(0.043, 0.075, 0.149);
          vec3 color2 = vec3(0.024, 0.055, 0.125);
          vec3 baseColor = mix(color1, color2, uv.y + 0.5 * sin(u_time * 0.2));
          float n1 = snoise(uv * 2.0 + u_time * 0.05 + mouse * 0.1);
          float n2 = snoise(uv * 4.0 - u_time * 0.08);
          float n3 = snoise(uv * 8.0 + u_time * 0.12);
          vec3 nebulaColor = vec3(0.88, 0.11, 0.28);
          float strength = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
          strength = smoothstep(0.1, 0.8, strength);
          float dist = distance(uv, mouse);
          float glow = 0.05 / (dist + 0.1);
          vec3 finalColor = baseColor + nebulaColor * strength * 0.25 + nebulaColor * glow * 0.15;
          float stars = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
          stars = pow(stars, 100.0) * (1.0 + sin(u_time + stars * 100.0));
          finalColor += stars * 0.5;
          gl_FragColor = vec4(finalColor, 1.0);
      }
  `;

  function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
  }

  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "position");
  const timeLocation = gl.getUniformLocation(program, "u_time");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const mouseLocation = gl.getUniformLocation(program, "u_mouse");

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
  });

  function render(time) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// Initialize layout context on page mount
document.addEventListener("DOMContentLoaded", initBackgroundEngine);
