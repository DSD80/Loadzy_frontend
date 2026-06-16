(function () {
  const defaultPhoto = "account and dash.png";

  function profileName(user) {
    const profile = user?.profile || {};
    return profile.name || profile.fullName || profile.organizationName || user?.username || "User";
  }

  function accountPage(role) {
    return {
      admin: "AdminAccInfo.html",
      driver: "DriverAccountInfo.html",
      operator: "OperatorAccountInfo.html"
    }[role] || "index.html";
  }

  function photoSrc(user) {
    const photoUrl = user?.profile?.photoUrl;
    return photoUrl ? `${LOADZY_API_URL}${photoUrl}` : defaultPhoto;
  }

  function installStyles() {
    if (document.getElementById("loadzy-user-header-style")) return;

    const style = document.createElement("style");
    style.id = "loadzy-user-header-style";
    style.textContent = `
      .loadzy-user-summary {
        position: absolute;
        top: 24px;
        right: 30px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 50;
        cursor: pointer;
      }

      .loadzy-user-summary .top-right-image {
        position: static !important;
        width: 46px !important;
        height: 46px !important;
        margin: 0 !important;
        border-radius: 50%;
        object-fit: cover;
        background: #fff;
        border: 2px solid rgba(0, 0, 0, 0.16);
      }

      .loadzy-user-name {
        max-width: 180px;
        font-family: "Kumbh Sans", Arial, sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #1b1b1b;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: rgba(255, 255, 255, 0.82);
        padding: 6px 10px;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
  }

  function renderUserHeader(user) {
    const image = document.querySelector(".top-right-image");
    if (!image || !user) return;

    installStyles();

    let wrapper = document.querySelector(".loadzy-user-summary");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "loadzy-user-summary";
      image.parentNode.insertBefore(wrapper, image);
      wrapper.appendChild(image);
    }

    let name = wrapper.querySelector(".loadzy-user-name");
    if (!name) {
      name = document.createElement("span");
      name.className = "loadzy-user-name";
      wrapper.appendChild(name);
    }

    image.src = photoSrc(user);
    image.alt = `${profileName(user)} profile photo`;
    name.textContent = profileName(user);
    wrapper.onclick = () => {
      window.location.href = accountPage(user.role);
    };
    image.onclick = null;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    if (!window.LoadzyAPI || !LoadzyAPI.token()) return;

    const cachedUser = LoadzyAPI.user();
    if (cachedUser) renderUserHeader(cachedUser);

    try {
      const { user } = await LoadzyAPI.request("/api/auth/me");
      localStorage.setItem("user", JSON.stringify(user));
      renderUserHeader(user);
    } catch (_err) {
      if (cachedUser) renderUserHeader(cachedUser);
    }
  });
})();
