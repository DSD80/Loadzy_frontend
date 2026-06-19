document.addEventListener("DOMContentLoaded", async () => {
  const cards1 = document.querySelector(".dashboard-cards1");
  const cards2 = document.querySelector(".dashboard-cards2");

  if (!cards1 || !cards2) return;

  cards1.innerHTML = '<div class="dashboard-card">Loading...</div>';
  cards2.innerHTML = '<div class="dashboard-card">Loading...</div>';

  try {
    const [driversRes, operatorsRes, vehiclesRes, tripsRes] = await Promise.all([
      LoadzyAPI.request("/api/users/drivers"),
      LoadzyAPI.request("/api/users/operators"),
      LoadzyAPI.request("/api/vehicles"),
      LoadzyAPI.request("/api/trips")
    ]);

    const drivers = driversRes.drivers || [];
    const operators = operatorsRes.operators || [];
    const vehicles = vehiclesRes.vehicles || [];
    const trips = tripsRes.trips || [];

    let activeTripsCount = 0;
    const activeDriverIds = new Set();
    
    for (const trip of trips) {
      if (trip.status === "assigned" || trip.status === "in_transit") {
        activeTripsCount++;
        if (trip.driver) {
          activeDriverIds.add(trip.driver._id ? trip.driver._id.toString() : trip.driver.toString());
        }
      }
    }

    const idleDriversCount = drivers.filter(d => !activeDriverIds.has(d._id.toString())).length;
    const assignedDriversCount = activeDriverIds.size;
    const operatorsCount = operators.length;
    const totalVehicles = vehicles.length;
    const vehiclesInMaintenance = vehicles.filter(v => v.availability === "maintenance").length;

    cards1.innerHTML = `
      <div class="dashboard-card">Total number of<br><strong>Idle Drivers: ${idleDriversCount}</strong></div>
      <div class="dashboard-card">Total number of<br><strong>Operators: ${operatorsCount}</strong></div>
      <div class="dashboard-card">Total number of<br><strong>Vehicles: ${totalVehicles}</strong></div>
    `;

    cards2.innerHTML = `
      <div class="dashboard-card">Vehicles in<br><strong>Maintenance: ${vehiclesInMaintenance}</strong></div>
      <div class="dashboard-card">Active Trips:<br><strong>${activeTripsCount}</strong></div>
      <div class="dashboard-card">Total number of<br>Assigned<br><strong>Drivers: ${assignedDriversCount}</strong></div>
    `;

  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    cards1.innerHTML = '<div class="dashboard-card" style="color:red">Failed to load data</div>';
    cards2.innerHTML = '';
  }
});
