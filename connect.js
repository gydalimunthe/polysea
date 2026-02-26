const languageContent = window.languageContent;
const params = new URLSearchParams(window.location.search);
let currentLanguage = params.get("lang") || "thai";
if (!languageContent[currentLanguage]) {
  currentLanguage = "thai";
}

const languageSelect = document.getElementById("languageSelect");
const currentLanguageLabel = document.getElementById("currentLanguage");
const speakerList = document.getElementById("speakerList");
const backLink = document.getElementById("backLink");

function renderSpeakers() {
  speakerList.innerHTML = "";
  languageContent[currentLanguage].speakers.forEach((speaker) => {
    const row = document.createElement("article");
    row.className = "list-item";
    row.innerHTML = `
      <div>
        <p><strong>${speaker.name}</strong> <span class="small-dot">•</span> <span class="small">${speaker.mode}</span></p>
        <p class="small">${speaker.focus}</p>
      </div>
      <button class="primary speaker-connect-btn" data-speaker="${speaker.name}">Connect</button>
    `;
    speakerList.appendChild(row);
  });
}

function renderLanguage() {
  languageSelect.value = currentLanguage;
  currentLanguageLabel.textContent = `Learning: ${languageContent[currentLanguage].displayName}`;
  backLink.href = `index.html?lang=${encodeURIComponent(currentLanguage)}`;
  renderSpeakers();
}

languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  renderLanguage();
});

speakerList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains("speaker-connect-btn")) {
    const speakerName = target.dataset.speaker || "Speaker";
    target.textContent = "Connecting...";
    target.setAttribute("disabled", "true");

    setTimeout(() => {
      alert(`Connected to ${speakerName}. Session invite sent.`);
      target.textContent = "Connected";
    }, 650);
  }
});

renderLanguage();
