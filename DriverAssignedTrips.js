document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".trip-cards");
  if (!container) return;

  try {
    const { trips } = await LoadzyAPI.request("/api/trips?status=assigned");
    if (!trips.length) {
      container.innerHTML = "<p>No assigned trips yet.</p>";
      return;
    }

    container.innerHTML = trips
      .map(
        (trip) => `
          <div class="trip-card">
            <p class="pp"><strong>Load Type:</strong> ${trip.loadType}</p>
            <p class="pp"><strong>Load Weight:</strong> ${trip.loadWeight}</p>
            <p class="pp"><strong>Pick Up Date:</strong> ${trip.pickupDate || "-"}</p>
            <p class="pp"><strong>Drop Date:</strong> ${trip.dropDate || "-"}</p>
            <p class="pp"><strong>Vehicle type:</strong> ${trip.vehicleType || "-"}</p>
            <p class="pp"><strong>Pick Up:</strong> ${trip.pickupAddress}</p>
            <p class="pp"><strong>Drop:</strong> ${trip.dropAddress}</p>
            <p class="pp"><strong>LINK :</strong> <a href="${trip.routeUrl || LoadzyAPI.googleMapsRoute(trip.pickupAddress, trip.dropAddress)}" target="_blank">Click Here</a></p>
          </div>
        `
      )
      .join("");
  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
});
