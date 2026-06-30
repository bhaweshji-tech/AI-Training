<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>AI Training Portal - Developer Edition</title>
    <!-- Tailwind CSS CDN with Plugins -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <!-- Supabase JS Client Library Library CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <!-- Google Fonts Framework Integration -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    <!-- Tailind Configuration Engine Script -->
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-tint": "#ffb3b6",
                        "surface-container": "#171f33",
                        "on-primary": "#68001a",
                        "error": "#ffb4ab",
                        "surface-container-high": "#222a3d",
                        "on-surface-variant": "#e5bdbe",
                        "on-secondary-fixed": "#191c1e",
                        "primary-container": "#e11d48",
                        "on-tertiary-container": "#fffaff",
                        "inverse-surface": "#dae2fd",
                        "primary-fixed": "#ffdada",
                        "background": "#0b1326",
                        "on-secondary-fixed-variant": "#444749",
                        "surface-bright": "#31394d",
                        "on-error-container": "#ffdad6",
                        "on-tertiary-fixed": "#0f0069",
                        "surface-dim": "#0b1326",
                        "on-surface": "#dae2fd",
                        "tertiary-fixed": "#e2dfff",
                        "primary-fixed-dim": "#ffb3b6",
                        "inverse-on-surface": "#283044",
                        "tertiary-fixed-dim": "#c3c0ff",
                        "surface-variant": "#2d3449",
                        "on-secondary-container": "#b6b9bb",
                        "primary": "#ffb3b6",
                        "surface-container-highest": "#2d3449",
                        "on-primary-fixed": "#40000c",
                        "outline": "#ac8889",
                        "secondary-container": "#464a4b",
                        "outline-variant": "#5c3f40",
                        "tertiary-container": "#645dfa",
                        "on-tertiary": "#1d00a5",
                        "inverse-primary": "#be0037",
                        "tertiary": "#c3c0ff",
                        "surface-container-low": "#131b2e",
                        "on-primary-fixed-variant": "#920028",
                        "on-secondary": "#2d3133",
                        "secondary": "#c4c7c9",
                        "surface": "#0b1326",
                        "secondary-fixed": "#e0e3e5",
                        "on-error": "#690005",
                        "secondary-fixed-dim": "#c4c7c9",
                        "on-background": "#dae2fd",
                        "on-tertiary-fixed-variant": "#3323cc",
                        "on-primary-container": "#fffaf9",
                        "error-container": "#93000a",
                        "surface-container-lowest": "#060e20",
                        "rating-bg": "#e11d48"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "xl": "48px",
                        "gutter": "24px",
                        "container-max": "1280px",
                        "sm": "8px",
                        "md": "16px",
                        "base": "4px",
                        "xs": "4px",
                        "lg": "24px"
                    },
                    "fontFamily": {
                        "label-sm": ["JetBrains Mono", "Geist"],
                        "headline-lg": ["Geist"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "display": ["Geist"],
                        "label-md": ["JetBrains Mono", "Geist"],
                        "headline-md": ["Geist"],
                        "headline-lg-mobile": ["Geist"]
                    },
                    "fontSize": {
                        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.08em", "fontWeight": "500" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
                        "display": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "800" }],
                        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "500" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "700" }]
                    },
                    "animation": {
                        "fade-in-up": "fadeInUp 0.6s ease-out forwards"
                    },
                    "keyframes": {
                        "fadeInUp": {
                            "0%": { opacity: "0", transform: "translateY(20px)" },
                            "100%": { opacity: "1", transform: "translateY(0)" }
                        }
                    }
                },
            },
        }
    </script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="flex flex-col min-h-screen selection:bg-primary-container selection:text-on-primary-container">
    
    <!-- Dynamic WebGL Backdrop Canvas Elements -->
    <canvas id="bg-canvas" width="1280" height="1162"></canvas>

    <!-- Dynamic Layout Header Injection Component Target placeholder -->
    <header id="shared-header"></header>

    <!-- Main Content Area Frame -->
    <main class="flex-grow p-lg md:p-xl max-w-container-max mx-auto w-full">
        <!-- Dashboard Section Title Wrapper Banner -->
        <header class="mb-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md p-lg rounded-xl glass-panel border-l-4 border-primary-container animate-fade-in-up">
            <div class="bg-black/30 p-5 rounded-lg backdrop-blur-md">
                <h2 class="font-headline-lg text-headline-lg text-white mb-xs uppercase tracking-widest font-bold">Explore Training Courses</h2>
                <p class="font-body-md text-body-md text-white/70 font-medium">Read real reviews or login to share your training experience.</p>
            </div>
            <div class="flex gap-sm items-center">
                <!-- Status Diagnostic Indicator Inside Control Header -->
                <div id="status" class="font-label-sm text-[11px] font-mono tracking-widest text-primary uppercase bg-black/40 border border-white/10 px-4 py-2 rounded">
                    Connecting...
                </div>
            </div>
        </header>

        <!-- Dynamic Content Insertion target element grid wrapper -->
        <div id="courseGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            <!-- Populated dynamically via app.js execution flow -->
        </div>
    </main>

    <!-- Dynamic Layout Footer Injection Component Target placeholder -->
    <div id="shared-footer"></div>

    <!-- Core Runtime Execution Initialization script entry points -->
    <script type="module" src="js/app.js"></script>
</body>
</html>
