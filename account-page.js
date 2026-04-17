const params = new URLSearchParams(window.location.search);
const preferredType = params.get("type") === "business" ? "business" : "member";
const nextPath = params.get("next") || "";
const sessionNode = document.querySelector("#account-session");

function setActiveTab(type) {
  document.querySelectorAll("[data-account-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.accountTab === type);
  });

  document.querySelectorAll("[data-account-form]").forEach((form) => {
    form.classList.toggle("is-hidden", form.dataset.accountForm !== type);
  });
}

function getSession() {
  const memberToken = localStorage.getItem("sajilo_member_token");
  const businessToken = localStorage.getItem("sajilo_business_token");
  const memberUser = localStorage.getItem("sajilo_member_user");
  const businessUser = localStorage.getItem("sajilo_business_user");

  return {
    member: memberToken && memberUser ? JSON.parse(memberUser) : null,
    business: businessToken && businessUser ? JSON.parse(businessUser) : null
  };
}

function renderSession() {
  const session = getSession();
  const cards = [];

  if (session.member) {
    cards.push(`
      <div>
        <p class="label">Member session</p>
        <strong>${session.member.email}</strong>
        <span>${session.member.role}</span>
      </div>
    `);
  }

  if (session.business) {
    cards.push(`
      <div>
        <p class="label">Business session</p>
        <strong>${session.business.email}</strong>
        <span>${session.business.role}</span>
      </div>
    `);
  }

  sessionNode.innerHTML = cards.length
    ? `
        <div class="account-session-grid">${cards.join("")}</div>
        <button id="account-logout" class="button secondary" type="button">Log out</button>
      `
    : `
        <p class="label">Not signed in</p>
        <strong>Choose member or business login.</strong>
      `;
}

function setNote(type, message, isSuccess = false) {
  const note = document.querySelector(`#${type}-note`);
  note.textContent = message;
  note.className = `form-note ${isSuccess ? "is-success" : "is-blocked"}`;
}

async function submitAccount(type, mode, form) {
  const formData = new FormData(form);
  const endpoint = `/api/auth/${type}/${mode}`;
  const payload =
    type === "member"
      ? {
          fullName: formData.get("fullName") || formData.get("email"),
          email: formData.get("email"),
          password: formData.get("password")
        }
      : {
          businessName: formData.get("businessName") || formData.get("email"),
          contactName: formData.get("contactName") || formData.get("businessName") || formData.get("email"),
          email: formData.get("email"),
          password: formData.get("password")
        };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Authentication failed");
    }

    localStorage.setItem(`sajilo_${type}_token`, result.token);
    localStorage.setItem(`sajilo_${type}_user`, JSON.stringify(result.user));
    localStorage.setItem("sajilo_token", result.token);

    setNote(type, `${mode === "signup" ? "Account created" : "Logged in"} as ${result.user.role}.`, true);
    renderSession();

    if (nextPath) {
      window.location.href = nextPath;
    }
  } catch (error) {
    setNote(type, error.message);
  }
}

document.querySelectorAll("[data-account-tab]").forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.accountTab));
});

document.querySelectorAll("[data-account-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitter = event.submitter;
    const mode = submitter?.value || "login";
    submitAccount(form.dataset.accountForm, mode, form);
  });
});

sessionNode.addEventListener("click", (event) => {
  if (!event.target.matches("#account-logout")) {
    return;
  }

  [
    "sajilo_member_token",
    "sajilo_business_token",
    "sajilo_member_user",
    "sajilo_business_user",
    "sajilo_token"
  ].forEach((key) => localStorage.removeItem(key));
  renderSession();
});

setActiveTab(preferredType);
renderSession();
