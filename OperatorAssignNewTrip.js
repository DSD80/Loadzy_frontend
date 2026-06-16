
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".trip-form");
  const toast = document.getElementById("toast");
  const sound = document.getElementById("submit-sound");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll(".trip-form input");
    const selects = document.querySelectorAll(".trip-form select");

    const trip = {
      loadType: inputs[0].value,
      loadWeight: inputs[1].value,
      pickupAddress: inputs[2].value,
      pickupDate: inputs[3].value,
      dropDate: inputs[4].value,
      dropAddress: inputs[5].value,
      pickupTime: inputs[6].value,
      dropTime: inputs[7].value,
      vehicleType: selects[0].value,
      paymentMode: selects[1].value
    };

    try {
      await LoadzyAPI.request("/api/trips", {
        method: "POST",
        body: JSON.stringify(trip)
      });

      if (sound) sound.play().catch(() => {});
      toast.classList.add("show");
      form.reset();

      setTimeout(() => toast.classList.remove("show"), 3000);
    } catch (err) {
      alert(err.message);
    }
  });
});
