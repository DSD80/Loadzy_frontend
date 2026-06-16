function roleFromPage() {
  const page = window.location.pathname.toLowerCase();
  if (page.includes("driver")) return "driver";
  if (page.includes("-op") || page.includes("operator")) return "operator";
  return "admin";
}

function dashboardFor(role) {
  return {
    admin: "AdminDashboard.html",
    driver: "Dashboard-Driver.html",
    operator: "opdash.html"
  }[role];
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-box");
  const signupForm = document.querySelector(".signup-box");
  const role = roleFromPage();

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const data = await LoadzyAPI.request("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            role,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
          })
        });

        LoadzyAPI.saveSession(data);
        window.location.href = data.dashboard || dashboardFor(role);
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirm").value;
      if (password !== confirm) {
        alert("Passwords do not match");
        return;
      }

      try {
        const data = await LoadzyAPI.request("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            role,
            username: document.getElementById("username").value,
            phone: document.getElementById("phone").value,
            password
          })
        });

        LoadzyAPI.saveSession(data);
        window.location.href = {
          admin: "BasicInfoAdmin.html",
          driver: "BasicInfoDriver.html",
          operator: "BasicInfoOperator.html"
        }[role];
      } catch (err) {
        alert(err.message);
      }
    });
  }
});
