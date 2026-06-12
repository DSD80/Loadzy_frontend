/*window.addEventListener("DOMContentLoaded", () => {
  const tripStack = document.getElementById("trip-stack");
  const trips = JSON.parse(localStorage.getItem("loadzy_trips")) || [];

  if (trips.length === 0) {
    tripStack.innerHTML = "<p>No pending trips yet.</p>";
    return;
  }

  trips.forEach((trip, index) => {
    const card = document.createElement("div");
    card.className = "trip-card";
    card.id = `trip-${index}`;

    card.innerHTML = `
      <strong>Trip #${index + 1}</strong><br>
      Load: ${trip.loadType} (${trip.weight})<br>
      Pickup: ${trip.pickup}<br>
      Drop: ${trip.drop}<br>
      Submitted on: ${trip.date}<br>
      <button onclick="showDriverDropdown(${index})">Assign Driver</button>
      <div class="assign-driver-form" id="assign-form-${index}" style="display: none; margin-top: 10px;">
        <label for="driver-select-${index}">Select Driver:</label>
        <select id="driver-select-${index}">
          <option value="" disabled selected>Choose a driver</option>
          <option value="Ram">Ram</option>
          <option value="Kannan">Kannan</option>
          <option value="Sham">Sham</option>
          <option value="Mukundhan">Mukundhan</option>
          <option value="Aravind">Aravind</option>
          <option value="Rahul">Rahul</option>
          <option value="Yogesh">Yogesh</option>
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

function assignDriver(index) {
  const select = document.getElementById(`driver-select-${index}`);
  const driver = select.value;

  if (!driver) {
    alert("Please select a driver");
    return;
  }

  // Simulate sending trip to driver
  sendTripToDriver(driver, index);

  // Remove the trip card from the view
  const card = document.getElementById(`trip-${index}`);
  if (card) {
    card.remove();
  }

  // Remove the trip from localStorage permanently
  let trips = JSON.parse(localStorage.getItem("loadzy_trips")) || [];
  trips.splice(index, 1);
  localStorage.setItem("loadzy_trips", JSON.stringify(trips));
}

function sendTripToDriver(driver, index) {
  const trips = JSON.parse(localStorage.getItem("loadzy_trips")) || [];
  const trip = trips[index];

  // Simulate sending details to driver (console or alert)
  alert(`Trip assigned to ${driver} with details:\nLoad: ${trip.loadType}\nFrom: ${trip.pickup}\nTo: ${trip.drop}`);
}*/


window.addEventListener("DOMContentLoaded", () => {
  const tripStack = document.getElementById("trip-stack");
  const trips = JSON.parse(localStorage.getItem("loadzy_trips")) || [];

  if (trips.length === 0) {
    tripStack.innerHTML = "<p>No pending trips yet.</p>";
    return;
  }

  trips.forEach((trip, index) => {
    const card = document.createElement("div");
    card.className = "trip-card";
    card.id = `trip-${index}`;

    card.innerHTML = `
      <strong>Trip #${index + 1}</strong><br>
      Load: ${trip.loadType} (${trip.weight})<br>
      Pickup: ${trip.pickup}<br>
      Drop: ${trip.drop}<br>
      Submitted on: ${trip.date}<br>
      <button onclick="showDriverDropdown(${index})">Assign Driver</button>
      <div class="assign-driver-form" id="assign-form-${index}" style="display: none; margin-top: 10px;">
        <label for="driver-select-${index}">Select Driver:</label>
        <select id="driver-select-${index}">
          <option value="" disabled selected>Choose a driver</option>
          <option value="Ram">Ram</option>
          <option value="Sham">Sham</option>
          <option value="Mukundhan">Mukundhan</option>
          <option value="Jay">Jay</option>
          <option value="Danial">Danial</option>
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

function assignDriver(index) {
  const select = document.getElementById(`driver-select-${index}`);
  const driver = select.value;

  if (!driver) {
    alert("Please select a driver");
    return;
  }

  // Simulate sending trip to driver
  sendTripToDriver(driver, index);

  // Remove the trip card from the view
  const card = document.getElementById(`trip-${index}`);
  if (card) {
    card.remove();
  }

  // Remove the trip from localStorage permanently
  let trips = JSON.parse(localStorage.getItem("loadzy_trips")) || [];
  const assignedTrip = trips.splice(index, 1)[0];
  localStorage.setItem("loadzy_trips", JSON.stringify(trips));

  // Add assigned trip as driver notification bubble count
  const driverNotifications = JSON.parse(localStorage.getItem("driver_notifications")) || {};
  if (!driverNotifications[driver]) {
    driverNotifications[driver] = [];
  }
  driverNotifications[driver].push({
    message: `New trip assigned: ${assignedTrip.loadType} from ${assignedTrip.pickup} to ${assignedTrip.drop}`,
    time: new Date().toLocaleString()
  });
  localStorage.setItem("driver_notifications", JSON.stringify(driverNotifications));

  // Update driver dashboard badge counter (if loaded in same session)
  const badge = document.getElementById("notification-badge");
  if (badge && driverNotifications[driver]) {
    badge.textContent = driverNotifications[driver].length;
    badge.style.display = "inline-block";
  }
}

function sendTripToDriver(driver, index) {
  const trips = JSON.parse(localStorage.getItem("loadzy_trips")) || [];
  const trip = trips[index];

  // Simulate sending details to driver (console or alert)
  alert(`Trip assigned to ${driver} with details:\nLoad: ${trip.loadType}\nFrom: ${trip.pickup}\nTo: ${trip.drop}`);
} 
