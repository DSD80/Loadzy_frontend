document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".driver-cards1");
  const container2 = document.querySelector(".driver-cards2");
  
  // Clear static content
  if (container) container.innerHTML = '<p>Loading drivers...</p>';
  if (container2) container2.innerHTML = '';

  try {
    const [driversRes, tripsRes] = await Promise.all([
      LoadzyAPI.request("/api/users/drivers"),
      LoadzyAPI.request("/api/trips")
    ]);

    const drivers = driversRes.drivers || [];
    const trips = tripsRes.trips || [];

    // Find which drivers are currently on active trips
    const activeDriverIds = new Set();
    for (const trip of trips) {
      if (trip.driver && (trip.status === "assigned" || trip.status === "in_transit")) {
        activeDriverIds.add(trip.driver._id ? trip.driver._id.toString() : trip.driver.toString());
      }
    }

    if (container) container.innerHTML = '';

    if (drivers.length === 0) {
      if (container) container.innerHTML = '<p>No drivers found.</p>';
      return;
    }

    drivers.forEach((driver, index) => {
      const name = driver.profile?.name || driver.username || "Unknown";
      const phone = driver.phone || "N/A";
      const isOnRoad = activeDriverIds.has(driver._id.toString());
      const status = isOnRoad ? "On the road" : "Idle";
      
      let linkHtml = "No Location";
      if (driver.currentLocation && driver.currentLocation.lat && driver.currentLocation.lng) {
        const url = `https://www.google.com/maps?q=${driver.currentLocation.lat},${driver.currentLocation.lng}`;
        linkHtml = `<a href="${url}" target="_blank">Click Here</a>`;
      }

      const cardHtml = `
        <div class="driver-card">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p class="pp"><strong>LINK :</strong> ${linkHtml}</p>
        </div>
      `;

      // Distribute evenly between the two containers to match the original static layout
      if (index < Math.ceil(drivers.length / 2)) {
        if (container) container.insertAdjacentHTML('beforeend', cardHtml);
      } else {
        if (container2) container2.insertAdjacentHTML('beforeend', cardHtml);
        else if (container) container.insertAdjacentHTML('beforeend', cardHtml); // Fallback
      }
    });

  } catch (err) {
    console.error("Error fetching drivers:", err);
    if (container) container.innerHTML = '<p style="color:red">Failed to load drivers.</p>';
  }
});
