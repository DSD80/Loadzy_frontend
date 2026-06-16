document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".info-box");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = LoadzyAPI.user();
    const role = user?.role || "driver";
    let profile;

    if (role === "operator") {
      profile = {
        fullName: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        organizationName: document.getElementById("orgname").value,
        organizationAddress: document.getElementById("orgaddress").value,
        pan: document.getElementById("pan").value
      };
    } else if (role === "admin") {
      profile = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        pan: document.getElementById("pan").value,
        degree: document.getElementById("degree").value,
        location: document.getElementById("location").value,
        address: document.getElementById("address").value
      };
    } else {
      profile = {
        name: document.getElementById("name").value,
        pan: document.getElementById("pan").value,
        comfortableVehicle: document.getElementById("vehicle").value,
        license: document.getElementById("license").value,
        address: document.getElementById("address").value,
        email: document.getElementById("email").value
      };
    }

    try {
      const data = await LoadzyAPI.request("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ profile })
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = { admin: "AdminDashboard.html", driver: "Dashboard-Driver.html", operator: "opdash.html" }[role];
    } catch (err) {
      alert(err.message);
    }
  });
});
