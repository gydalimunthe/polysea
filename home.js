// Inject Gemini-Style Chat CSS
const style = document.createElement('style');
style.textContent = `
  :root {
    --earth-bg: #e9e0d1;
    --earth-panel: #f7f2e9;
    --earth-panel-strong: #d7c3a6;
    --earth-sidebar: #2f271f;
    --earth-sidebar-soft: #4a3e30;
    --earth-ink: #2b241d;
    --earth-muted: #6e6459;
    --earth-user: #84664a;
    --earth-user-ink: #fff8ef;
    --earth-ring: #b69f83;
  }

  body, html { height: 100%; margin: 0; overflow: hidden; }
  body {
    font-family: "Source Sans 3", sans-serif;
    color: var(--earth-ink);
    background: radial-gradient(circle at 15% 10%, #f1eadf 0%, #ded3c1 45%, #d2c3af 100%);
    display: block;
    padding: 0;
    min-height: 100vh;
  }

  .layout-shell {
    height: 100%;
    width: 100vw;
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: 0;
  }

  .sidebar {
    background: linear-gradient(180deg, var(--earth-sidebar) 0%, #241d16 100%);
    color: #f6ecdf;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    padding: 22px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-badge {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: linear-gradient(135deg, #9a7651, #6f5439);
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.02em;
  }

  .sidebar-brand strong {
    display: block;
    font-size: 1rem;
    line-height: 1.1;
  }

  .sidebar-brand p {
    margin: 2px 0 0;
    color: #cfbca8;
    font-size: 0.82rem;
  }

  .sidebar-note {
    margin: 18px 0 0;
    color: #cfbca8;
    line-height: 1.45;
    font-size: 0.92rem;
  }

  .sidebar-foot {
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #a6937e;
  }

  .auth-strip {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid rgba(214, 190, 165, 0.3);
    display: grid;
    gap: 8px;
  }

  .auth-email {
    margin: 0;
    color: #d9c7b2;
    font-size: 0.78rem;
    letter-spacing: 0.02em;
    word-break: break-all;
  }

  .logout-btn {
    width: 100%;
    border: 1px solid rgba(214, 190, 165, 0.5);
    background: rgba(255, 248, 239, 0.1);
    color: #f3e6d8;
    border-radius: 8px;
    padding: 7px 10px;
    font: inherit;
    font-size: 0.83rem;
    cursor: pointer;
  }

  .logout-btn:hover {
    background: rgba(255, 248, 239, 0.18);
  }

  .app-shell {
    height: 100%;
    width: auto;
    max-width: none;
    display: flex;
    flex-direction: column;
    background: rgba(247, 242, 233, 0.7);
    backdrop-filter: blur(3px);
    min-height: 0;
    overflow: hidden;
    border: none;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }

  .chat-header {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    border-bottom: 1px solid rgba(98, 78, 57, 0.2);
    background: rgba(250, 246, 239, 0.9);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .chat-header h1 { font-size: 1.08rem; margin: 0; color: #43362a; }
  .chat-header p { font-size: 0.84rem; margin: 0; color: var(--earth-muted); }

  .logo-mark {
    background: linear-gradient(145deg, #8e6f50, #6d5239);
    color: #fff3e4;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
  }

  .chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 28px 24px 164px;
    scroll-behavior: smooth;
    position: relative;
    min-height: 0;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }

  .messages-area {
    width: 100%;
    max-width: none;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .welcome-message {
    max-width: none;
    margin: 7vh auto 0;
    text-align: center;
    transition: opacity 0.5s;
  }

  .welcome-message h2 {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(2rem, 4vw, 3.1rem);
    color: #5f4631;
    margin: 0 0 10px 0;
  }

  .welcome-message p { color: var(--earth-muted); font-size: 1.05rem; margin: 0; }
  .welcome-message.hidden { opacity: 0; pointer-events: none; display: none; }

  .message-row { display: flex; gap: 12px; width: 100%; animation: fadeIn 0.25s ease-out; }
  .message-row.user { justify-content: flex-end; }

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .bot-avatar { background: #eee3d2; border: 1px solid rgba(101, 80, 58, 0.2); }

  .bubble {
    padding: 12px 16px;
    border-radius: 16px;
    max-width: min(76%, 760px);
    line-height: 1.58;
    font-size: 1rem;
    position: relative;
    white-space: pre-wrap;
  }

  .user .bubble {
    background: linear-gradient(180deg, #8f6d4c, #7c5f44);
    color: var(--earth-user-ink);
    border-radius: 16px 6px 16px 16px;
    box-shadow: 0 6px 16px rgba(63, 43, 27, 0.22);
  }

  .bot .bubble {
    background: var(--earth-panel);
    border: 1px solid rgba(104, 83, 62, 0.2);
    color: var(--earth-ink);
    border-radius: 6px 16px 16px 16px;
  }

  .input-container {
    position: fixed;
    bottom: 0;
    left: 280px;
    right: 0;
    padding: 18px 24px 24px;
    background: linear-gradient(to top, rgba(233, 224, 209, 0.98) 65%, rgba(233, 224, 209, 0));
    display: flex;
    justify-content: center;
    z-index: 20;
  }

  .input-wrapper {
    background: #f9f4eb;
    border-radius: 16px;
    padding: 8px 10px 8px 14px;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: none;
    transition: background 0.2s, box-shadow 0.2s;
    border: 1px solid var(--earth-ring);
    box-shadow: 0 10px 28px rgba(74, 56, 39, 0.14);
  }

  .input-wrapper:focus-within {
    box-shadow: 0 0 0 2px rgba(182, 159, 131, 0.3), 0 12px 28px rgba(74, 56, 39, 0.2);
  }

  #chatInput {
    flex: 1;
    border: none;
    background: transparent;
    padding: 10px 10px 10px 2px;
    font-size: 1rem;
    outline: none;
    color: var(--earth-ink);
    font-family: "Source Sans 3", sans-serif;
  }

  #chatInput::placeholder { color: #8f8376; }

  #sendBtn {
    background: linear-gradient(180deg, #8c6b4b, #73573f);
    border: none;
    cursor: pointer;
    color: #fff6ec;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s, filter 0.2s;
    flex-shrink: 0;
  }

  #sendBtn:hover { filter: brightness(1.05); transform: translateY(-1px); }
  #sendBtn:disabled { opacity: 0.45; cursor: default; transform: none; }

  .typing-indicator span { display: inline-block; width: 6px; height: 6px; background: #8f8376; border-radius: 50%; margin: 0 2px; animation: bounce 1.4s infinite ease-in-out both; }
  .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

  .scroll-controls {
    position: fixed;
    right: 24px;
    bottom: 118px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 30;
    opacity: 1;
    pointer-events: auto;
  }

  .scroll-btn {
    min-width: 74px;
    height: 36px;
    border: 1px solid var(--earth-ring);
    border-radius: 18px;
    background: #f8f1e4;
    color: #43362a;
    box-shadow: 0 4px 12px rgba(50, 38, 26, 0.2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    padding: 0 10px;
  }

  .scroll-btn:hover {
    background: #f2e7d5;
  }

  .scroll-btn:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .language-shortcut {
    width: 100%;
    margin-top: 14px;
    background: rgba(246, 236, 223, 0.08);
    border: 1px solid rgba(214, 190, 165, 0.35);
    border-radius: 12px;
    padding: 10px;
    backdrop-filter: blur(2px);
  }

  .language-shortcut h3 {
    margin: 0 0 8px;
    font-size: 0.84rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #ead8c2;
  }

  .shortcut-row {
    display: grid;
    gap: 6px;
    margin-bottom: 8px;
  }

  .shortcut-row:last-child {
    margin-bottom: 0;
  }

  .shortcut-row label {
    font-size: 0.78rem;
    color: #cfbca8;
  }

  .shortcut-row select {
    width: 100%;
    border: 1px solid rgba(214, 190, 165, 0.45);
    background: rgba(255, 248, 239, 0.95);
    color: #3a2d21;
    border-radius: 8px;
    padding: 7px 9px;
    font: inherit;
    font-size: 0.9rem;
  }

  .thread-panel {
    margin-top: 12px;
    border: 1px solid rgba(214, 190, 165, 0.25);
    border-radius: 12px;
    padding: 10px;
    background: rgba(246, 236, 223, 0.05);
  }

  .new-chat-btn {
    width: 100%;
    border: 1px solid rgba(214, 190, 165, 0.45);
    background: rgba(255, 248, 239, 0.12);
    color: #f3e6d8;
    border-radius: 8px;
    padding: 8px 10px;
    font: inherit;
    font-size: 0.86rem;
    font-weight: 600;
    cursor: pointer;
  }

  .new-chat-btn:hover {
    background: rgba(255, 248, 239, 0.22);
  }

  .thread-list {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
    max-height: 220px;
    overflow-y: auto;
    display: grid;
    gap: 6px;
  }

  .thread-item-btn {
    width: 100%;
    text-align: left;
    border: 1px solid rgba(214, 190, 165, 0.2);
    background: rgba(255, 248, 239, 0.06);
    color: #e7d8c6;
    border-radius: 8px;
    padding: 7px 8px;
    font: inherit;
    cursor: pointer;
  }

  .thread-item-btn:hover {
    background: rgba(255, 248, 239, 0.12);
  }

  .thread-item-btn.active {
    background: rgba(255, 248, 239, 0.28);
    color: #2d241b;
    border-color: rgba(214, 190, 165, 0.5);
    font-weight: 600;
  }

  .thread-empty {
    margin: 8px 0 0;
    color: #cfbca8;
    font-size: 0.78rem;
  }

  @media (max-width: 980px) {
    .layout-shell { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .language-shortcut {
      position: fixed;
      top: 10px;
      left: 10px;
      width: 168px;
      margin-top: 0;
      padding: 8px;
      z-index: 40;
      background: rgba(246, 236, 223, 0.96);
      border: 1px solid rgba(119, 92, 67, 0.32);
      box-shadow: 0 8px 24px rgba(40, 30, 20, 0.18);
    }
    .language-shortcut h3 { font-size: 0.74rem; margin-bottom: 6px; color: #4e3d2d; }
    .shortcut-row { gap: 4px; margin-bottom: 6px; }
    .shortcut-row label { font-size: 0.72rem; color: #6e5a47; }
    .shortcut-row select { font-size: 0.78rem; padding: 6px 7px; }
    .input-container {
      left: 0;
      padding: 14px 12px 16px;
    }
    .chat-header { padding: 14px 14px; }
    .chat-container { padding: 18px 12px 132px; }
    .bubble { max-width: 88%; }
    .scroll-controls { right: 12px; bottom: 90px; }
  }
  
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(style);

const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const messagesArea = document.getElementById("messagesArea");
const welcomeMessage = document.getElementById("welcomeMessage");
const chatContainer = document.getElementById("chatContainer");
const sidebarTop = document.querySelector(".sidebar-top");
const sidebarFoot = document.querySelector(".sidebar-foot");
const scrollControls = document.createElement("div");
scrollControls.className = "scroll-controls";
scrollControls.innerHTML = `
  <button id="scrollTopBtn" class="scroll-btn" type="button" aria-label="Scroll to top">Top ↑</button>
  <button id="scrollBottomBtn" class="scroll-btn" type="button" aria-label="Scroll to bottom">Latest ↓</button>
`;
document.body.appendChild(scrollControls);
const languageShortcut = document.createElement("section");
languageShortcut.className = "language-shortcut";
languageShortcut.innerHTML = `
  <h3>Learning Focus</h3>
  <div class="shortcut-row">
    <label for="languageSelect">Language</label>
    <select id="languageSelect">
      <option value="vietnamese">Vietnamese</option>
      <option value="indonesian">Indonesian</option>
      <option value="filipino">Filipino</option>
      <option value="thai">Thai</option>
    </select>
  </div>
  <div class="shortcut-row">
    <label for="levelSelect">Level</label>
    <select id="levelSelect">
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
  </div>
`;
if (sidebarTop) {
  sidebarTop.appendChild(languageShortcut);
} else {
  document.body.appendChild(languageShortcut);
}
const threadPanel = document.createElement("section");
threadPanel.className = "thread-panel";
threadPanel.innerHTML = `
  <button id="newChatBtn" class="new-chat-btn" type="button">+ New Chat</button>
  <ul id="threadList" class="thread-list"></ul>
  <p id="threadEmptyText" class="thread-empty">No chats yet for this learning mode.</p>
`;
if (sidebarTop) {
  sidebarTop.appendChild(threadPanel);
}
const scrollTopBtn = document.getElementById("scrollTopBtn");
const scrollBottomBtn = document.getElementById("scrollBottomBtn");
const languageSelect = document.getElementById("languageSelect");
const levelSelect = document.getElementById("levelSelect");
const welcomeSubtitle = welcomeMessage.querySelector("p");
const newChatBtn = document.getElementById("newChatBtn");
const threadList = document.getElementById("threadList");
const threadEmptyText = document.getElementById("threadEmptyText");
const authStrip = document.createElement("div");
authStrip.className = "auth-strip";
authStrip.innerHTML = `
  <p id="authEmail" class="auth-email">Signed in</p>
  <button id="logoutBtn" class="logout-btn" type="button">Log Out</button>
`;
if (sidebarFoot) {
  sidebarFoot.replaceWith(authStrip);
}
const authEmail = document.getElementById("authEmail");
const logoutBtn = document.getElementById("logoutBtn");

let chatHistory = [];
let chatThreads = [];
let activeThreadId = null;
// Allow overriding the API base at runtime (set `window.API_BASE_URL` in the hosting
// platform or default to the Render backend URL). This makes the frontend deployable
// to Vercel or Netlify while the backend runs on Render.
const API_BASE_URL = window.API_BASE_URL || "https://polysea.onrender.com";
const CHAT_STORAGE_PREFIX = "polysea_chat_threads_v1";
const CHAT_SETTINGS_KEY = "polysea_chat_settings_v1";
const AUTH_TOKEN_KEY = "polysea_auth_token_v1";
const AUTH_USER_KEY = "polysea_auth_user_v1";
const MAX_HISTORY_MESSAGES = 40;
const MAX_THREADS = 30;
const DEFAULT_SETTINGS = { language: "thai", level: "beginner" };
let chatSettings = { ...DEFAULT_SETTINGS };
const LANGUAGE_LABELS = {
  vietnamese: "Vietnamese",
  indonesian: "Indonesian",
  filipino: "Filipino",
  thai: "Thai",
};

function redirectToLogin() {
  window.location.href = "login.html";
}

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
}

function loadAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.email === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
}

async function ensureAuthenticated() {
  const token = getAuthToken();
  if (!token) {
    redirectToLogin();
    return false;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      clearAuth();
      redirectToLogin();
      return false;
    }
    const data = await response.json();
    if (data?.user?.email) {
      const storage = localStorage.getItem(AUTH_TOKEN_KEY) ? localStorage : sessionStorage;
      storage.setItem(AUTH_USER_KEY, JSON.stringify({ email: data.user.email }));
      if (authEmail) authEmail.textContent = data.user.email;
    }
    return true;
  } catch {
    redirectToLogin();
    return false;
  }
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
    updateScrollControls();
  });
}

function scrollToTop() {
  chatContainer.scrollTo({ top: 0, behavior: "smooth" });
}

function updateScrollControls() {
  const hasOverflow = chatContainer.scrollHeight > chatContainer.clientHeight + 8;
  scrollTopBtn.disabled = !hasOverflow;
  scrollBottomBtn.disabled = !hasOverflow;
  const nearTop = chatContainer.scrollTop < 24;
  const nearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 24;

  scrollTopBtn.disabled = hasOverflow ? nearTop : true;
  scrollBottomBtn.disabled = hasOverflow ? nearBottom : true;
}

function formatMessage(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function getThreadStorageKey() {
  return `${CHAT_STORAGE_PREFIX}_${chatSettings.language}_${chatSettings.level}`;
}

function sanitizeMessages(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .slice(-MAX_HISTORY_MESSAGES);
}

function makeThread(messages = []) {
  const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    title: "New Chat",
    updatedAt: Date.now(),
    messages: sanitizeMessages(messages),
  };
}

function saveThreadStore() {
  try {
    const payload = {
      activeThreadId,
      threads: chatThreads.slice(0, MAX_THREADS),
    };
    localStorage.setItem(getThreadStorageKey(), JSON.stringify(payload));
  } catch (error) {
    console.error("Unable to save chat history", error);
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(CHAT_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    const language = typeof parsed?.language === "string" ? parsed.language : DEFAULT_SETTINGS.language;
    const level = typeof parsed?.level === "string" ? parsed.level : DEFAULT_SETTINGS.level;
    const safeLanguage = ["vietnamese", "indonesian", "filipino", "thai"].includes(language) ? language : DEFAULT_SETTINGS.language;
    const safeLevel = ["beginner", "intermediate", "advanced"].includes(level) ? level : DEFAULT_SETTINGS.level;
    return { language: safeLanguage, level: safeLevel };
  } catch (error) {
    console.error("Unable to load chat settings", error);
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  try {
    localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(chatSettings));
  } catch (error) {
    console.error("Unable to save chat settings", error);
  }
}

function syncShortcutMenu() {
  languageSelect.value = chatSettings.language;
  levelSelect.value = chatSettings.level;
}

function updateWelcomeText() {
  if (!welcomeSubtitle) return;
  const label = LANGUAGE_LABELS[chatSettings.language] || "Thai";
  welcomeSubtitle.textContent = `I can help you learn ${label}.`;
}

function getThreadTitle(messages) {
  const firstUser = messages.find((m) => m.role === "user" && m.content.trim());
  if (!firstUser) return "New Chat";
  const clean = firstUser.content.replace(/\s+/g, " ").trim();
  return clean.length > 34 ? `${clean.slice(0, 34)}...` : clean;
}

function setActiveThread(threadId) {
  const found = chatThreads.find((thread) => thread.id === threadId);
  if (!found) return;
  activeThreadId = found.id;
  chatHistory = sanitizeMessages(found.messages);
  renderHistory();
  renderThreadList();
  saveThreadStore();
}

function createNewChat() {
  const thread = makeThread([]);
  chatThreads = [thread, ...chatThreads].slice(0, MAX_THREADS);
  activeThreadId = thread.id;
  chatHistory = [];
  renderThreadList();
  renderHistory();
  saveThreadStore();
}

function renderThreadList() {
  if (!threadList || !threadEmptyText) return;
  threadList.innerHTML = "";
  if (chatThreads.length === 0) {
    threadEmptyText.style.display = "block";
    return;
  }
  threadEmptyText.style.display = "none";
  chatThreads.forEach((thread) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thread-item-btn";
    if (thread.id === activeThreadId) {
      btn.classList.add("active");
    }
    btn.textContent = thread.title || "New Chat";
    btn.addEventListener("click", () => setActiveThread(thread.id));
    li.appendChild(btn);
    threadList.appendChild(li);
  });
}

function loadThreadStore() {
  try {
    const raw = localStorage.getItem(getThreadStorageKey());
    if (!raw) {
      chatThreads = [makeThread([])];
      activeThreadId = chatThreads[0].id;
      chatHistory = [];
      return;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const migratedThread = makeThread(sanitizeMessages(parsed));
      migratedThread.title = getThreadTitle(migratedThread.messages);
      chatThreads = [migratedThread];
      activeThreadId = migratedThread.id;
      chatHistory = migratedThread.messages;
      saveThreadStore();
      return;
    }
    if (!parsed || !Array.isArray(parsed.threads)) {
      chatThreads = [makeThread([])];
      activeThreadId = chatThreads[0].id;
      chatHistory = [];
      return;
    }
    const safeThreads = parsed.threads
      .filter((t) => t && typeof t.id === "string")
      .map((t) => {
        const messages = sanitizeMessages(t.messages);
        return {
          id: t.id,
          title: typeof t.title === "string" && t.title.trim() ? t.title : getThreadTitle(messages),
          updatedAt: typeof t.updatedAt === "number" ? t.updatedAt : Date.now(),
          messages,
        };
      })
      .slice(0, MAX_THREADS);
    chatThreads = safeThreads.length > 0 ? safeThreads : [makeThread([])];
    const existingActive = chatThreads.find((t) => t.id === parsed.activeThreadId);
    activeThreadId = existingActive ? existingActive.id : chatThreads[0].id;
    const activeThread = chatThreads.find((thread) => thread.id === activeThreadId);
    chatHistory = activeThread ? activeThread.messages : [];
  } catch (error) {
    console.error("Unable to load chat history", error);
    chatThreads = [makeThread([])];
    activeThreadId = chatThreads[0].id;
    chatHistory = [];
  }
}

function renderHistory() {
  messagesArea.innerHTML = "";
  if (chatHistory.length === 0) {
    welcomeMessage.classList.remove("hidden");
    updateScrollControls();
    return;
  }
  chatHistory.forEach((message) => {
    const role = message.role === "assistant" ? "bot" : "user";
    appendMessage(role, message.content);
  });
  scrollToBottom();
}

function syncActiveThread() {
  const idx = chatThreads.findIndex((thread) => thread.id === activeThreadId);
  if (idx === -1) return;
  const updatedMessages = sanitizeMessages(chatHistory);
  const updatedThread = {
    ...chatThreads[idx],
    messages: updatedMessages,
    title: getThreadTitle(updatedMessages),
    updatedAt: Date.now(),
  };
  chatThreads.splice(idx, 1);
  chatThreads.unshift(updatedThread);
  activeThreadId = updatedThread.id;
  chatHistory = updatedThread.messages;
  renderThreadList();
  saveThreadStore();
}

function appendMessage(role, text) {
  welcomeMessage.classList.add("hidden");
  
  const row = document.createElement("div");
  row.className = `message-row ${role}`;
  
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  
  const formattedText = formatMessage(text);
  bubble.innerHTML = formattedText;

  if (role === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "avatar bot-avatar";
    avatar.innerHTML = "✨"; // Sparkle icon for AI
    row.appendChild(avatar);
    row.appendChild(bubble);
  } else {
    row.appendChild(bubble);
  }

  messagesArea.appendChild(row);
  
  scrollToBottom();
}

function showTypingIndicator() {
  const row = document.createElement("div");
  row.className = "message-row bot typing-row";
  row.innerHTML = `
    <div class="avatar bot-avatar">✨</div>
    <div class="bubble">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  messagesArea.appendChild(row);
  scrollToBottom();
  return row;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  const token = getAuthToken();
  if (!token) {
    redirectToLogin();
    return;
  }

  chatInput.value = "";
  appendMessage("user", text);
  
  const typingRow = showTypingIndicator();

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: text,
        history: chatHistory,
        language: chatSettings.language,
        level: chatSettings.level,
      })
    });
    if (response.status === 401) {
      typingRow.remove();
      clearAuth();
      redirectToLogin();
      return;
    }
    
    const data = await response.json();
    typingRow.remove();
    
    appendMessage("bot", data.response);
    
    // Update history (simplified)
    chatHistory.push({ role: "user", content: text });
    chatHistory.push({ role: "assistant", content: data.response });
    chatHistory = chatHistory.slice(-MAX_HISTORY_MESSAGES);
    syncActiveThread();
    
  } catch (err) {
    typingRow.remove();
    const fallback = "Sorry, I couldn't connect to the server. Make sure `server.py` is running.";
    appendMessage("bot", fallback);
    chatHistory.push({ role: "user", content: text });
    chatHistory.push({ role: "assistant", content: fallback });
    chatHistory = chatHistory.slice(-MAX_HISTORY_MESSAGES);
    syncActiveThread();
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

chatSettings = loadSettings();
syncShortcutMenu();
updateWelcomeText();
loadThreadStore();
renderThreadList();
renderHistory();
const authUser = loadAuthUser();
if (authEmail) {
  authEmail.textContent = authUser?.email || "Signed in";
}
window.addEventListener("resize", updateScrollControls);
chatContainer.addEventListener("scroll", updateScrollControls);
scrollTopBtn.addEventListener("click", scrollToTop);
scrollBottomBtn.addEventListener("click", scrollToBottom);
languageSelect.addEventListener("change", () => {
  chatSettings.language = languageSelect.value;
  saveSettings();
  updateWelcomeText();
  loadThreadStore();
  renderThreadList();
  renderHistory();
});
levelSelect.addEventListener("change", () => {
  chatSettings.level = levelSelect.value;
  saveSettings();
  loadThreadStore();
  renderThreadList();
  renderHistory();
});
if (newChatBtn) {
  newChatBtn.addEventListener("click", () => {
    createNewChat();
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearAuth();
    redirectToLogin();
  });
}
updateScrollControls();
ensureAuthenticated();
