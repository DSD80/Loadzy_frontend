// ============================================================
// LOADZY DRIVER - ASSIGNED TRIPS PAGE
// Fetches active trips (assigned / in_transit) from the API
// Cancel → status: 'cancelled' (appears in Cancelled Trips)
// Complete → status: 'completed' (appears in Completed Trips)
// ============================================================

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function loadSidebarGreeting() {
  const user = LoadzyAPI.user();
  const nameEl = document.getElementById("sidebar-driver-name");
  if (nameEl && user) {
    nameEl.textContent = user.profile?.name || user.username || "Driver";
  }
}

async function fetchTrips() {
  const container = document.getElementById("assigned-trips-grid");
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">⏳</div>
      <p>Loading assigned trips...</p>
    </div>`;

  try {
    const { trips } = await LoadzyAPI.request("/api/trips");

    const activeTrips = trips.filter(t => t.status === "assigned" || t.status === "in_transit");

    if (!activeTrips.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🚛</div>
          <p>No active trips assigned to you.</p>
        </div>`;
      return;
    }

    container.innerHTML = activeTrips
      .map((trip, i) => {
        const statusLabel = trip.status === "in_transit" ? "in_transit" : "assigned";
        let buttons = "";

        if (trip.status === "assigned") {
          buttons = `
            <div class="trip-actions">
              <button class="btn-action btn-taken" onclick="updateTripStatus('${trip._id}', 'in_transit')">✓ Trip Taken</button>
              <button class="btn-action btn-cancel" onclick="updateTripStatus('${trip._id}', 'cancelled')">✕ Cancel Trip</button>
            </div>`;
        } else if (trip.status === "in_transit") {
          buttons = `
            <div class="trip-actions">
              <button class="btn-action btn-complete" onclick="updateTripStatus('${trip._id}', 'completed')">✔ Mark Complete</button>
            </div>`;
        }

        return `
          <div class="trip-card">
            <div class="trip-card-header">
              <span class="trip-card-title">Trip #${i + 1}</span>
              <span class="status-badge ${statusLabel}">${statusLabel.replace("_", " ")}</span>
            </div>
            <div class="trip-row"><strong>Load Type</strong><span>${trip.loadType || "—"}</span></div>
            <div class="trip-row"><strong>Load Weight</strong><span>${trip.loadWeight || "—"}</span></div>
            <div class="trip-row"><strong>Vehicle</strong><span>${trip.vehicleType || "—"}</span></div>
            <div class="trip-row"><strong>Pick Up Date</strong><span>${formatDate(trip.pickupDate)}</span></div>
            <div class="trip-row"><strong>Drop Date</strong><span>${formatDate(trip.dropDate)}</span></div>
            <div class="trip-row"><strong>From</strong><span>${trip.pickupAddress || "—"}</span></div>
            <div class="trip-row"><strong>To</strong><span>${trip.dropAddress || "—"}</span></div>
            <div class="trip-row"><strong>Route</strong>
              <a href="${trip.routeUrl || LoadzyAPI.googleMapsRoute(trip.pickupAddress, trip.dropAddress)}" target="_blank">View Map ↗</a>
            </div>
            ${buttons}
          </div>`;
      })
      .join("");
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>${err.message}</p>
      </div>`;
  }
}

async function updateTripStatus(tripId, status) {
  const messages = {
    in_transit: "Confirm you have taken this trip and are now in transit?",
    completed: "Mark this trip as completed?",
    cancelled: "Are you sure you want to cancel this trip? It will move to your Cancelled Trips list."
  };

  if (!confirm(messages[status] || `Set status to ${status}?`)) return;

  try {
    await LoadzyAPI.request(`/api/trips/${tripId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });

    showDriverToast(
      status === "completed" ? "Trip marked as completed!" :
        status === "cancelled" ? "Trip cancelled." :
          "Status updated!"
    );

    setTimeout(() => fetchTrips(), 600);
  } catch (err) {
    alert(err.message);
  }
}

function showDriverToast(msg) {
  const t = document.getElementById("driver-toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  loadSidebarGreeting();
  fetchTrips();
});
