let pendingTrips = [];
let drivers = [];

window.addEventListener("DOMContentLoaded", async () => {
  const tripStack = document.getElementById("trip-stack");

  try {
    const [tripData, driverData] = await Promise.all([
      LoadzyAPI.request("/api/trips?status=pending"),
      LoadzyAPI.request("/api/users/drivers")
    ]);
    pendingTrips = tripData.trips;
    drivers = driverData.drivers;
  } catch (err) {
    tripStack.innerHTML = `<p>${err.message}</p>`;
    return;
  }

  if (pendingTrips.length === 0) {
    tripStack.innerHTML = "<p>No pending trips yet.</p>";
    return;
  }

  pendingTrips.forEach((trip, index) => {
    const card = document.createElement("div");
    card.className = "trip-card";
    card.id = `trip-${index}`;
    const options = drivers
      .map((driver) => `<option value="${driver._id}">${driver.profile?.name || driver.username}</option>`)
      .join("");

    card.innerHTML = `
      <strong>Trip #${index + 1}</strong><br>
      Load: ${trip.loadType} (${trip.loadWeight})<br>
      Pickup: ${trip.pickupAddress}<br>
      Drop: ${trip.dropAddress}<br>
      Submitted on: ${new Date(trip.createdAt).toLocaleString()}<br>
      <button onclick="showDriverDropdown(${index})">Assign Driver</button>
      <div class="assign-driver-form" id="assign-form-${index}" style="display: none; margin-top: 10px;">
        <label for="driver-select-${index}">Select Driver:</label>
        <select id="driver-select-${index}">
          <option value="" disabled selected>Choose a driver</option>
          ${options}
        </select>
        <button onclick="assignDriver(${index})">Confirm</button>
      </div>
      <hr/>
    `;
    tripStack.appendChild(card);
  });
});

function showDriverDropdown(index) {
  document.getElementById(`assign-form-${index}`).style.display = 'flex';
}

async function assignDriver(index) {
  const select = document.getElementById(`driver-select-${index}`);
  const driverId = select.value;

  if (!driverId) {
    alert("Please select a driver");
    return;
  }

  const trip = pendingTrips[index];

  try {
    await LoadzyAPI.request(`/api/trips/${trip._id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ driverId })
    });

    const card = document.getElementById(`trip-${index}`);
    if (card) card.remove();
    alert("Trip assigned successfully");
  } catch (err) {
    alert(err.message);
  }
}
