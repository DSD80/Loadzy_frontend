async function fetchTrips() {
  const container = document.querySelector(".trip-cards");
  if (!container) return;

  try {
    const { trips } = await LoadzyAPI.request("/api/trips");
    
    // Filter for assigned and in_transit
    const activeTrips = trips.filter(t => t.status === 'assigned' || t.status === 'in_transit');

    if (!activeTrips.length) {
      container.innerHTML = "<p>No active trips yet.</p>";
      return;
    }

    container.innerHTML = activeTrips
      .map((trip) => {
        let buttons = '';
        if (trip.status === 'assigned') {
          buttons = `
            <div class="trip-actions" style="margin-top: 15px;">
              <button class="btn btn-success" onclick="updateTripStatus('${trip._id}', 'in_transit')">Trip Taken</button>
              <button class="btn btn-danger" onclick="updateTripStatus('${trip._id}', 'pending')">Cancel</button>
            </div>
          `;
        } else if (trip.status === 'in_transit') {
          buttons = `
            <div class="trip-actions" style="margin-top: 15px;">
              <button class="btn btn-primary" onclick="updateTripStatus('${trip._id}', 'completed')">Trip Complete</button>
            </div>
          `;
        }

        return `
          <div class="trip-card">
            <p class="pp"><strong>Load Type:</strong> ${trip.loadType}</p>
            <p class="pp"><strong>Load Weight:</strong> ${trip.loadWeight}</p>
            <p class="pp"><strong>Pick Up Date:</strong> ${trip.pickupDate || "-"}</p>
            <p class="pp"><strong>Drop Date:</strong> ${trip.dropDate || "-"}</p>
            <p class="pp"><strong>Vehicle type:</strong> ${trip.vehicleType || "-"}</p>
            <p class="pp"><strong>Pick Up:</strong> ${trip.pickupAddress}</p>
            <p class="pp"><strong>Drop:</strong> ${trip.dropAddress}</p>
            <p class="pp"><strong>Status:</strong> <span style="text-transform: capitalize;">${trip.status.replace('_', ' ')}</span></p>
            <p class="pp"><strong>LINK :</strong> <a href="${trip.routeUrl || LoadzyAPI.googleMapsRoute(trip.pickupAddress, trip.dropAddress)}" target="_blank">Click Here</a></p>
            ${buttons}
            <div class="dropdown-icon" style="text-align: right; margin-top: 10px;">
              <img onclick="location.href='Assigned2.html?id=${trip._id}'" src="expand arrow.png" class="ar" style="cursor: pointer;">
            </div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
}

async function updateTripStatus(tripId, status) {
  try {
    let confirmMsg = `Are you sure you want to mark this trip as ${status.replace('_', ' ')}?`;
    if (status === 'pending') {
      confirmMsg = "Are you sure you want to cancel this trip?";
    }
    
    if (!confirm(confirmMsg)) return;
    
    await LoadzyAPI.request(`/api/trips/${tripId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    alert("Trip status updated successfully!");
    fetchTrips();
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", fetchTrips);
