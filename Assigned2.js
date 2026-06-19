const urlParams = new URLSearchParams(window.location.search);
const tripId = urlParams.get('id');

const sound = document.getElementById('notif-sound');
function playSound() {
  if (sound) {
    sound.play().catch(err => console.log("Autoplay blocked:", err));
  }
}

async function loadTripDetails() {
  const container = document.querySelector(".trip-cards");
  if (!container) return;

  if (!tripId) {
    container.innerHTML = "<p>No trip ID provided.</p>";
    return;
  }

  try {
    const { trip } = await LoadzyAPI.request(`/api/trips/${tripId}`);
    
    let buttons = '';
    if (trip.status === 'assigned') {
      buttons = `
        <button class="status-btn" onclick="updateStatus('in_transit')">Mark as Trip Taken</button>
        <button class="status-btn" style="background-color: #8b0000;" onclick="updateStatus('pending')">Cancel Trip</button>
      `;
    } else if (trip.status === 'in_transit') {
      buttons = `
        <button class="status-btn" onclick="updateStatus('completed')">Mark as Completed</button>
      `;
    }

    container.innerHTML = `
      <div class="trip-cardexpanded">
        <p><strong>Load Type:</strong> ${trip.loadType}</p>
        <p><strong>Load Weight:</strong> ${trip.loadWeight}</p>
        <p><strong>Pick Up Date:</strong> ${trip.pickupDate || "-"}</p>
        <p><strong>Drop Date:</strong> ${trip.dropDate || "-"}</p>
        <p><strong>Vehicle type:</strong> ${trip.vehicleType || "-"}</p>
        <p><strong>LINK:</strong> 
          <a href="${trip.routeUrl || LoadzyAPI.googleMapsRoute(trip.pickupAddress, trip.dropAddress)}" target="_blank">
            Click to View
          </a>
        </p>

        <p><strong>Pick Up (Address):</strong><br>
          ${trip.pickupAddress}</p>

        <p><strong>Drop (Address):</strong><br>
          ${trip.dropAddress}</p>

        <div class="buttons">
          ${buttons}
        </div>
        <audio id="notif-sound" src="notify.mp3" preload="auto"></audio>
        <p class="status-label">Current Status: <span id="changeText" style="text-transform: capitalize;">${trip.status.replace('_', ' ')}</span></p>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
}

async function updateStatus(newStatus) {
  try {
    let confirmMsg = `Are you sure you want to mark this trip as ${newStatus.replace('_', ' ')}?`;
    if (newStatus === 'pending') {
      confirmMsg = "Are you sure you want to cancel this trip?";
    }
    
    if (!confirm(confirmMsg)) return;
    
    await LoadzyAPI.request(`/api/trips/${tripId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus })
    });
    
    playSound();
    if (newStatus === 'pending') {
      alert("Trip cancelled successfully!");
      window.location.href = "Dashboard_AssignedTrips-Driver.html";
    } else {
      alert("Trip status updated successfully!");
      loadTripDetails();
    }
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", loadTripDetails);
