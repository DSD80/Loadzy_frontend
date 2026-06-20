const accountFieldMap = {
  driver: [
    { id: "fullname", label: "FULL NAME", source: "profile.name" },
    { id: "email", label: "EMAIL ID", source: "profile.email", type: "email" },
    { id: "phone", label: "PHONE NUMBER", source: "phone" },
    { id: "pan", label: "PAN NUMBER", source: "profile.pan" },
    { id: "license", label: "LICENSE NUMBER", source: "profile.license" },
    { id: "vehicle", label: "COMFORTABLE VEHICLE", source: "profile.comfortableVehicle" },
    { id: "address", label: "ADDRESS", source: "profile.address" },
    { id: "username", label: "USERNAME", source: "username", editable: false }
  ],
  operator: [
    { id: "fullname", label: "FULL NAME", source: "profile.fullName" },
    { id: "email", label: "EMAIL ID", source: "profile.email", type: "email" },
    { id: "phone", label: "PHONE NUMBER", source: "phone" },
    { id: "pan", label: "PAN NUMBER", source: "profile.pan" },
    { id: "orgname", label: "ORGANIZATION NAME", source: "profile.organizationName" },
    { id: "orgaddress", label: "ADDRESS OF ORGANIZATION", source: "profile.organizationAddress" },
    { id: "username", label: "USERNAME", source: "username", editable: false }
  ],
  admin: [
    { id: "fullname", label: "FULL NAME", source: "profile.name" },
    { id: "email", label: "EMAIL ID", source: "profile.email", type: "email" },
    { id: "phone", label: "PHONE NUMBER", source: "phone" },
    { id: "pan", label: "PAN NUMBER", source: "profile.pan" },
    { id: "degree", label: "HIGHEST DEGREE PURSUED", source: "profile.degree" },
    { id: "location", label: "LOCATION TO SUPERVISE", source: "profile.location" },
    { id: "address", label: "ADDRESS", source: "profile.address" },
    { id: "username", label: "USERNAME", source: "username", editable: false }
  ]
};

function readPath(obj, path) {
  return path.split(".").reduce((value, key) => value?.[key], obj) || "";
}

function writePath(target, path, value) {
  const parts = path.split(".");
  let cursor = target;
  while (parts.length > 1) {
    const key = parts.shift();
    cursor[key] = cursor[key] || {};
    cursor = cursor[key];
  }
  cursor[parts[0]] = value;
}

function showToast(text = "SAVED") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function setProfilePhoto(user) {
  const profileImg = document.querySelector(".profile");
  const photoUrl = user?.profile?.photoUrl;
  if (profileImg) {
    profileImg.src = photoUrl ? `${LOADZY_API_URL}${photoUrl}` : "account (2).png";
    profileImg.style.objectFit = "cover";
  }
}

function installAccountStyles() {
  if (document.getElementById("loadzy-account-style")) return;
  const style = document.createElement("style");
  style.id = "loadzy-account-style";
  style.textContent = `
    .form-group input.editing {
      outline: 2px solid orange;
      background: #fffdf0;
    }
    .form-group input[readonly] {
      color: #222;
    }
    .edit.disabled-edit {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .password-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    .password-panel {
      display: none;
      width: 100%;
      gap: 12px;
      align-items: flex-end;
      flex-wrap: wrap;
      margin-top: 12px;
    }
    .password-panel.show {
      display: flex;
    }
    .password-panel input {
      width: 210px;
      height: 35px;
      border: none;
      border-radius: 5px;
      padding: 0 10px;
      font-weight: bold;
    }
    .account-action-btn,
    .remove-photo-btn,
    .view-photo-btn {
      background: linear-gradient(to right, #255f6e, #3a7384);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      padding: 10px 14px;
      box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.45);
    }
    .remove-photo-btn {
      background: #8f2f2f;
      margin-top: 12px;
      width: 180px;
    }
    .view-photo-btn {
      margin-top: 12px;
      width: 180px;
    }
    .account-right {
      gap: 10px;
    }
    .photo-modal .photo-options {
      gap: 14px;
      justify-content: center;
      flex-wrap: wrap;
    }
  `;
  document.head.appendChild(style);
}

function renderAccountForm(user) {
  const fields = accountFieldMap[user.role] || accountFieldMap.driver;
  const grid = document.querySelector(".form-grid");
  if (!grid) return;

  const midpoint = Math.ceil(fields.length / 2);
  const columns = [fields.slice(0, midpoint), fields.slice(midpoint)];

  grid.innerHTML = columns
    .map(
      (column, index) => `
        <div class="col-${index + 1}">
          ${column
            .map(
              (field) => `
                <div class="form-group">
                  <label for="${field.id}">
                    ${field.label}
                    <img class="edit ${field.editable === false ? "disabled-edit" : ""}" src="pen.png" data-field="${field.id}" alt="Edit ${field.label}">
                  </label>
                  <input type="${field.type || "text"}" id="${field.id}" data-source="${field.source}" value="${readPath(user, field.source)}" ${field.editable === false ? "data-locked=\"true\"" : ""} readonly />
                </div>
              `
            )
            .join("")}
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".edit").forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = document.getElementById(icon.dataset.field);
      if (!input || input.dataset.locked === "true") return;
      input.readOnly = false;
      input.classList.add("editing");
      input.focus();
      input.select();
    });
  });
}

function ensurePasswordControls() {
  if (document.querySelector(".password-actions")) return;
  const saveBtn = document.querySelector(".save-btn");
  if (!saveBtn) return;

  const wrapper = document.createElement("div");
  wrapper.className = "password-actions";
  wrapper.innerHTML = `
    <button class="account-action-btn" id="changePasswordToggle" type="button">Change Password</button>
    <div class="password-panel" id="passwordPanel">
      <input type="password" id="currentPassword" placeholder="Current password">
      <input type="password" id="newPassword" placeholder="New password">
      <input type="password" id="confirmPassword" placeholder="Confirm password">
      <button class="account-action-btn" id="updatePasswordButton" type="button">Update Password</button>
    </div>
  `;
  saveBtn.insertAdjacentElement("afterend", wrapper);

  document.getElementById("changePasswordToggle").addEventListener("click", () => {
    document.getElementById("passwordPanel").classList.toggle("show");
  });

  document.getElementById("updatePasswordButton").addEventListener("click", updatePassword);
}

function ensurePhotoControls() {
  const accountRight = document.querySelector(".account-right");
  const profileImg = document.querySelector(".profile");
  const changePhoto = document.querySelector(".change-photo");
  if (!accountRight || !profileImg) return;

  if (changePhoto && changePhoto.parentElement !== accountRight) {
    accountRight.appendChild(changePhoto);
  }

  if (!document.querySelector(".view-photo-btn")) {
    const viewButton = document.createElement("button");
    viewButton.className = "view-photo-btn";
    viewButton.type = "button";
    viewButton.textContent = "VIEW PHOTO";
    viewButton.addEventListener("click", () => {
      window.open(profileImg.src, "_blank");
    });
    accountRight.insertBefore(viewButton, changePhoto || null);
  }

  if (!document.querySelector(".remove-photo-btn")) {
    const removeButton = document.createElement("button");
    removeButton.className = "remove-photo-btn";
    removeButton.type = "button";
    removeButton.textContent = "REMOVE PHOTO";
    removeButton.addEventListener("click", removePhoto);
    accountRight.appendChild(removeButton);
  }
}

async function saveAccount() {
  const payload = { profile: {} };
  document.querySelectorAll(".form-group input[data-source]").forEach((input) => {
    if (input.dataset.locked === "true") return;
    if (input.dataset.source === "phone") {
      payload.phone = input.value.trim();
    } else {
      writePath(payload, input.dataset.source, input.value.trim());
    }
  });

  try {
    const data = await LoadzyAPI.request("/api/auth/account", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    localStorage.setItem("user", JSON.stringify(data.user));
    renderAccountForm(data.user);
    setProfilePhoto(data.user);
    showToast("UPDATED");
  } catch (err) {
    alert(err.message);
  }
}

async function updatePassword() {
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    alert("New password and confirm password do not match");
    return;
  }

  try {
    await LoadzyAPI.request("/api/auth/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword })
    });
    document.getElementById("passwordPanel").classList.remove("show");
    ["currentPassword", "newPassword", "confirmPassword"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    showToast("PASSWORD UPDATED");
  } catch (err) {
    alert(err.message);
  }
}

async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);

  const data = await LoadzyAPI.request("/api/auth/profile/photo", {
    method: "POST",
    body: formData
  });

  localStorage.setItem("user", JSON.stringify(data.user));
  setProfilePhoto(data.user);
  showToast("PHOTO UPDATED");
}

async function removePhoto() {
  try {
    const data = await LoadzyAPI.request("/api/auth/profile/photo", { method: "DELETE" });
    localStorage.setItem("user", JSON.stringify(data.user));
    setProfilePhoto(data.user);
    showToast("PHOTO REMOVED");
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  installAccountStyles();
  ensurePasswordControls();
  ensurePhotoControls();

  let activeUser = LoadzyAPI.user();
  try {
    const { user } = await LoadzyAPI.request("/api/auth/me");
    activeUser = user;
    localStorage.setItem("user", JSON.stringify(user));
  } catch (_err) {
    // Keep cached data visible if the backend is temporarily unreachable.
  }

  if (activeUser) {
    renderAccountForm(activeUser);
    setProfilePhoto(activeUser);
  }

  document.querySelector(".save-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    saveAccount();
  });

  document.querySelectorAll(".photo-options button").forEach((button) => {
    button.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = async () => {
        if (!fileInput.files.length) return;
        try {
          await uploadPhoto(fileInput.files[0]);
          document.getElementById("photoModal").style.display = "none";
        } catch (err) {
          alert(err.message);
        }
      };
      fileInput.click();
    });
  });
});
