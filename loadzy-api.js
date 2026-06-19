const LOADZY_API_URL = "http://localhost:5000";

const LoadzyAPI = {
  token() {
    return localStorage.getItem("token");
  },

  user() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  },

  async request(path, options = {}) {
    const headers = options.headers || {};
    const isFormData = options.body instanceof FormData;

    if (!isFormData) headers["Content-Type"] = "application/json";
    if (this.token()) headers.Authorization = `Bearer ${this.token()}`;

    const res = await fetch(`${LOADZY_API_URL}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  },

  googleMapsRoute(pickup, drop) {
    const origin = encodeURIComponent(pickup);
    const destination = encodeURIComponent(drop);
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  }
};

// Global interceptor for logout buttons
document.addEventListener("click", (e) => {
  const target = e.target.closest("div, button, a, img");
  if (!target) return;
  
  const isLogout = 
    target.id === "logoutButton" ||
    (target.hasAttribute("onclick") && target.getAttribute("onclick").includes("index.html")) ||
    (target.querySelector && target.querySelector("img[src='logout.png']"));

  if (isLogout) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      LoadzyAPI.logout();
    }
  }
}, true);
