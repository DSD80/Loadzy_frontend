document.querySelector(".login-box").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // save token
    localStorage.setItem("token", data.token);

    // redirect
    window.location.href = "AdminDashboard.html";

  } catch (err) {
    console.error("Login error:", err);
    alert("Server not reachable");
  }
});
