const languageContent = window.languageContent;
const params = new URLSearchParams(window.location.search);
let currentLanguage = params.get("lang") || "thai";
if (!languageContent[currentLanguage]) {
  currentLanguage = "thai";
}

const languageSelect = document.getElementById("languageSelect");
const currentLanguageLabel = document.getElementById("currentLanguage");
const situationList = document.getElementById("situationList");
const backLink = document.getElementById("backLink");

function renderSituations() {
  situationList.innerHTML = "";
  languageContent[currentLanguage].situations.forEach((item, index) => {
    const detailUrl = `situation.html?lang=${encodeURIComponent(currentLanguage)}&id=${index}`;
    const row = document.createElement("article");
    row.className = "list-item";
    row.innerHTML = `
      <div>
        <p><strong>${item.context}</strong></p>
        <p class="small">${item.phrase}</p>
      </div>
      <a class="secondary action-link" href="${detailUrl}">Open</a>
    `;
    situationList.appendChild(row);
  });
}

function renderLanguage() {
  languageSelect.value = currentLanguage;
  currentLanguageLabel.textContent = `Learning: ${languageContent[currentLanguage].displayName}`;
  backLink.href = `index.html?lang=${encodeURIComponent(currentLanguage)}`;
  renderSituations();
}

languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  renderLanguage();
});

renderLanguage();
