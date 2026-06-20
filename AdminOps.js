document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".operator-cards");
  
  if (container) container.innerHTML = '<p>Loading operators...</p>';

  try {
    const [operatorsRes, vehiclesRes, tripsRes] = await Promise.all([
      LoadzyAPI.request("/api/users/operators"),
      LoadzyAPI.request("/api/vehicles"),
      LoadzyAPI.request("/api/trips")
    ]);

    const operators = operatorsRes.operators || [];
    const vehicles = vehiclesRes.vehicles || [];
    const trips = tripsRes.trips || [];

    // Compute stats per operator
    const statsByOperator = {};
    
    operators.forEach(op => {
      statsByOperator[op._id.toString()] = {
        totalVehicles: 0,
        tripsPending: 0
      };
    });

    // Count vehicles per operator based on who they belong to... 
    // Wait, vehicles don't have an operator directly in the schema? Let's check or assume they are assigned to trips?
    // Let's just count all vehicles or maybe trips assigned to operator.
    // If we look at trips, we can count pending trips per operator.
    let matchedTrips = 0;
    for (const trip of trips) {
      if (trip.operator && (trip.status === "pending" || trip.status === "cancelled")) {
        const opId = trip.operator._id ? trip.operator._id.toString() : trip.operator.toString();
        if (statsByOperator[opId]) {
          statsByOperator[opId].tripsPending++;
          matchedTrips++;
        }
      }
    }
    
    for (const vehicle of vehicles) {
      if (vehicle.operator) {
        const opId = vehicle.operator._id ? vehicle.operator._id.toString() : vehicle.operator.toString();
        if (statsByOperator[opId]) {
          statsByOperator[opId].totalVehicles++;
        }
      }
    }

    if (container) container.innerHTML = `<p style="display:none;">Debug: Total Trips: ${trips.length}, Matched: ${matchedTrips}</p>`;

    if (operators.length === 0) {
      if (container) container.innerHTML += '<p>No operators found.</p>';
      return;
    }

    operators.forEach(op => {
      const name = op.profile?.organizationName || op.profile?.name || op.username || "Unknown Operator";
      const stats = statsByOperator[op._id.toString()];
      
      // In case vehicle operator linking is not implemented, we might not have a vehicle count.
      const totalVehicles = stats ? stats.totalVehicles : 0;
      const tripsPending = stats ? stats.tripsPending : 0;

      const cardHtml = `
        <div class="operator-card">
          <strong>${name}</strong>
          <p>Total Vehicles: ${totalVehicles}</p>
          <p>Trips Pending: ${tripsPending}</p>
        </div>
      `;

      if (container) container.insertAdjacentHTML('beforeend', cardHtml);
    });

  } catch (err) {
    console.error("Error fetching operators:", err);
    if (container) container.innerHTML = '<p style="color:red">Failed to load operators.</p>';
  }
});
