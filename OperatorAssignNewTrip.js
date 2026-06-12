
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.submit-btn');
    const toast = document.getElementById('toast');
    const sound = document.getElementById('submit-sound'); // <-- sound element

    submitButton.addEventListener('click', (e) => {
      e.preventDefault(); // prevent form from submitting

      // Play sound
      if (sound) {
        sound.play().catch(err => console.log("Autoplay blocked:", err));
      }

      // Show toast
      toast.classList.add('show');

      // Hide toast after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    });
  });



  document.querySelector(".submit-btn").addEventListener("click", (e) => {
  e.preventDefault();

  // Collect trip data
  const trip = {
    loadType: document.querySelectorAll("input")[0].value,
    weight: document.querySelectorAll("input")[1].value,
    pickup: document.querySelectorAll("input")[2].value,
    drop: document.querySelectorAll("input")[3].value,
    date: new Date().toLocaleString()
  };

  // Get existing trips
  let trips = JSON.parse(localStorage.getItem("loadzy_trips")) || [];
  trips.push(trip);
  localStorage.setItem("loadzy_trips", JSON.stringify(trips));

  alert("Trip submitted successfully!");
});

