const API_BASE_URL = "http://127.0.0.1:5050";
const AUTH_TOKEN_KEY = "polysea_auth_token_v1";
const AUTH_USER_KEY = "polysea_auth_user_v1";

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const confirmWrap = document.getElementById("confirmWrap");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const showPasswordCheckbox = document.getElementById("showPasswordCheckbox");
const rememberCheckbox = document.getElementById("rememberCheckbox");
const submitBtn = document.getElementById("submitBtn");
const errorText = document.getElementById("errorText");

let mode = "login";

function setMode(nextMode) {
  mode = nextMode;
  loginTab.classList.toggle("active", mode === "login");
  registerTab.classList.toggle("active", mode === "register");
  submitBtn.textContent = mode === "login" ? "Login" : "Create Account";
  passwordInput.setAttribute("autocomplete", mode === "login" ? "current-password" : "new-password");
  confirmWrap.classList.toggle("hidden", mode !== "register");
  confirmPasswordInput.required = mode === "register";
  if (mode !== "register") {
    confirmPasswordInput.value = "";
  }
  errorText.textContent = "";
}

function clearAllAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
}

function saveAuth(token, user, remember) {
  clearAllAuthStorage();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_TOKEN_KEY, token);
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function getTokenFromAnyStorage() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
}

async function checkExistingSession() {
  const token = getTokenFromAnyStorage();
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      window.location.href = "index.html";
    } else {
      clearAllAuthStorage();
    }
  } catch {
    // Ignore transient connectivity failures on initial load
  }
}

loginTab.addEventListener("click", () => setMode("login"));
registerTab.addEventListener("click", () => setMode("register"));
showPasswordCheckbox.addEventListener("change", () => {
  const type = showPasswordCheckbox.checked ? "text" : "password";
  passwordInput.type = type;
  confirmPasswordInput.type = type;
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorText.textContent = "";
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const remember = rememberCheckbox.checked;
  if (!email || !password) {
    errorText.textContent = "Please fill in all fields.";
    return;
  }
  if (mode === "register" && password !== confirmPassword) {
    errorText.textContent = "Passwords do not match.";
    return;
  }

  const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
  submitBtn.disabled = true;
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      errorText.textContent = data.error || "Authentication failed.";
      return;
    }
    saveAuth(data.token, data.user, remember);
    window.location.href = "index.html";
  } catch (error) {
    errorText.textContent = "Could not reach server. Start server.py and try again.";
    console.error(error);
  } finally {
    submitBtn.disabled = false;
  }
});

checkExistingSession();
