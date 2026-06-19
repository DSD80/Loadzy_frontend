
(function () {
  const DEFAULT_PHOTO = "account (2).png";

  function displayName(user) {
    const p = user?.profile || {};
    return (
      p.name ||
      p.fullName ||
      p.organizationName ||
      user?.username ||
      "User"
    );
  }

  function accountPage(role) {
    return (
      { admin: "AdminAccInfo.html", driver: "DriverAccountInfo.html", operator: "OperatorAccountInfo.html" }[role] ||
      "index.html"
    );
  }

  function photoSrc(user) {
    const url = user?.profile?.photoUrl;
    return url ? `${LOADZY_API_URL}${url}` : DEFAULT_PHOTO;
  }

  function applyToDOM(user) {
    if (!user) return;

    /* profile picture */
    const img = document.querySelector(".loadzy-user-summary .top-right-image");
    if (img) {
      img.src = photoSrc(user);
      img.alt = displayName(user) + " profile photo";
      img.onerror = function () { this.src = DEFAULT_PHOTO; };
    }

    /* name text */
    const nameEl = document.querySelector(".loadzy-user-summary .loadzy-user-name");
    if (nameEl) {
      nameEl.textContent = displayName(user);
    }

    /* make the whole pill navigate to the correct account page */
    const wrapper = document.querySelector(".loadzy-user-summary");
    if (wrapper) {
      wrapper.onclick = function () {
        window.location.href = accountPage(user.role);
      };
    }
  }

  document.addEventListener("DOMContentLoaded", async function () {
    
    // 1. Paint immediately from localStorage cache so the user sees data at once
    const cached = LoadzyAPI.user();
    console.log(cached)
    if (cached) applyToDOM(cached);

    // 2. Then refresh from the server so it stays up-to-date
    try {
      const { user } = await LoadzyAPI.request("/api/auth/me");
      localStorage.setItem("user", JSON.stringify(user));
      applyToDOM(user);
    } catch (_) {
      // network error – cached version already shown, nothing more to do
    }
  });
})();
