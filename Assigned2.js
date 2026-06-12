 let update=document.getElementById("changeText");
function triptaken(){
    update.textContent="Trip Taken";
    
}
function pickedup(){
    update.textContent="Picked Up";
    
}
function completed(){
    update.textContent="Trip Completed";
    
}




  const sound = document.getElementById('notif-sound');

  function playSound() {
    if (sound) {
      sound.play().catch(err => console.log("Autoplay blocked:", err));
    }
  }

  function triptaken() {
    playSound();
    document.getElementById("changeText").innerText = "Trip Taken";
  }

  function pickedup() {
    playSound();
    document.getElementById("changeText").innerText = "Picked Up";
  }

  function completed() {
    playSound();
    document.getElementById("changeText").innerText = "Completed";
  }

