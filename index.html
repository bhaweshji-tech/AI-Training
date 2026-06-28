// ✅ Supabase Config
const SUPABASE_URL = "https://gsdblteofsongnjdjhpc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u9dNq32zPDAFOO415PArvQ_ljzEEiaC";

// Initialize Supabase Client
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Load data from Supabase
async function loadData() {
  const status = document.getElementById("status");
  const cards = document.getElementById("cards");

  status.innerText = "Loading data...";
  cards.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("trainingdata")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    status.innerText = "Error: " + error.message;
    return;
  }

  if (!data || data.length === 0) {
    status.innerText = "No records found";
    return;
  }

  status.innerText = `Loaded ${data.length} records successfully`;

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:shadow-blue-950/20 transition-all duration-300 flex flex-col justify-between";

    div.innerHTML = `
      <div>
        <span class="text-xs bg-blue-950 text-blue-400 border border-blue-800/50 px-3 py-1 rounded-full font-medium">
          ${item.tech || "General"}
        </span>

        <h3 class="text-xl font-bold mt-4 text-slate-100">
          ${item.title || "Untitled Project"}
        </h3>

        <p class="text-slate-400 mt-2 mb-6 text-sm leading-relaxed">
          ${item.desc || "No description provided."}
        </p>
      </div>

      <a href="${item.link || "#"}" target="_blank"
         class="text-sm text-blue-400 font-semibold hover:text-blue-300 flex items-center mt-auto group">
        Visit Link 
        <span class="transform group-hover:translate-x-1 transition-transform ml-1">→</span>
      </a>
    `;

    cards.appendChild(div);
  });
}

// Auto-load records when DOM is ready
document.addEventListener("DOMContentLoaded", loadData);
