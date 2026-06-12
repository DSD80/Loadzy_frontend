let idleTime = 0;
  const maxIdleSeconds = 10;

 
  setInterval(() => {
    idleTime++;
    if (idleTime === maxIdleSeconds) {
      showIdleWarning();
    }
  }, 1000);

  
  ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evt => {
    document.addEventListener(evt, () => {
      idleTime = 0;
    });
  });

  function showIdleWarning() {
    const warning = document.createElement("div");
    warning.className = "idle-warning";
    warning.innerHTML = `
      <p>You’ve been inactive for a while. Still there?</p>
      <button onclick="closeIdleWarning()">Yes, I'm here</button>
    `;
    document.body.appendChild(warning);
  }

  function closeIdleWarning() {
    const warning = document.querySelector(".idle-warning");
    if (warning) warning.remove();
    idleTime = 0;
  }

