async function fetchCompletedTrips() {
  const container = document.getElementById("completed-trips-grid");
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">⏳</div>
      <p>Loading completed trips...</p>
    </div>`;
  try {
    const { trips } = await LoadzyAPI.request("/api/trips");
    const completedTrips = trips.filter(t => t.status === "completed");
    if (!completedTrips.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <p>No completed trips yet.</p>
        </div>`;
      return;
    }
    container.innerHTML = completedTrips
      .map((trip, i) => `
        <div class="trip-card">
          <div class="trip-card-header">
            <span class="trip-card-title">Trip #${i + 1}</span>
            <span class="status-badge completed">Completed</span>
          </div>
          <div class="trip-row"><strong>Load Type</strong><span>${trip.loadType || "—"}</span></div>
          <div class="trip-row"><strong>Load Weight</strong><span>${trip.loadWeight || "—"}</span></div>
          <div class="trip-row"><strong>Vehicle</strong><span>${trip.vehicleType || "—"}</span></div>
          <div class="trip-row"><strong>Pick Up Date</strong><span>${formatDate(trip.pickupDate)}</span></div>
          <div class="trip-row"><strong>Drop Date</strong><span>${formatDate(trip.dropDate)}</span></div>
          <div class="trip-row"><strong>From</strong><span>${trip.pickupAddress || "—"}</span></div>
          <div class="trip-row"><strong>To</strong><span>${trip.dropAddress || "—"}</span></div>
          <div class="trip-row"><strong>Route</strong>
            <a href="${trip.routeUrl || LoadzyAPI.googleMapsRoute(trip.pickupAddress, trip.dropAddress)}" target="_blank">View Map</a>
          </div>
        </div>
      `)
      .join("");
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>${err.message}</p>
      </div>`;
  }
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
// Load driver name into sidebar greeting
function loadSidebarGreeting() {
  const user = LoadzyAPI.user();
  const nameEl = document.getElementById("sidebar-driver-name");
  if (nameEl && user) {
    nameEl.textContent = user.profile?.name || user.username || "Driver";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadSidebarGreeting();
  fetchCompletedTrips();
});