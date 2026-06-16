document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".expanded-trip-card");
  const tableBody = document.querySelector("tbody");

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const params = new URLSearchParams({
        type: document.getElementById("vehicleType").value,
        location: document.getElementById("currentLocation").value,
        availability: document.getElementById("availability").value
      });
      window.location.href = `OperatorStatusResult.html?${params.toString()}`;
    });
  }

  if (tableBody) {
    const params = new URLSearchParams(window.location.search);
    LoadzyAPI.request(`/api/vehicles?${params.toString()}`)
      .then(({ vehicles }) => {
        if (!vehicles.length) {
          tableBody.innerHTML = "<tr><td colspan=\"5\">No vehicles found.</td></tr>";
          return;
        }

        tableBody.innerHTML = vehicles
          .map(
            (vehicle) => `
              <tr>
                <td>${vehicle.vehicleId}</td>
                <td>${vehicle.type}</td>
                <td>${vehicle.capacity || "-"}</td>
                <td>${vehicle.location || "-"}</td>
                <td><button class="track-btn" data-id="${vehicle._id}">SELECT</button></td>
              </tr>
            `
          )
          .join("");
      })
      .catch((err) => {
        tableBody.innerHTML = `<tr><td colspan="5">${err.message}</td></tr>`;
      });
  }
});
