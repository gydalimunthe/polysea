const languageContent = window.languageContent;

const practiceTemplatesByLanguage = {
  thai: ['"สบายดีไหม?"', '"พูดช้าๆ ได้ไหม?"', '"ขอบคุณมาก!"'],
  vietnamese: ['"Bạn khỏe không?"', '"Bạn có thể nói chậm hơn không?"', '"Cảm ơn bạn nhiều!"'],
  indonesian: ['"Apa kabar?"', '"Bisa bicara pelan-pelan?"', '"Terima kasih banyak!"'],
  filipino: ['"Kumusta ka?"', '"Puwede bang dahan-dahan magsalita?"', '"Maraming salamat!"'],
};
const voiceLangByLanguage = {
  thai: "th-TH",
  vietnamese: "vi-VN",
  indonesian: "id-ID",
  filipino: "fil-PH",
};

// Inject Styles
const style = document.createElement('style');
style.textContent = `
  .list-item { transition: transform 0.1s; }
  .list-item:active { transform: scale(0.98); }
  .repeat-btn { border-radius: 20px; }
`;
document.head.appendChild(style);

const params = new URLSearchParams(window.location.search);
const lang = params.get("lang") || "thai";
const id = Number(params.get("id") || 0);
const safeLanguage = languageContent[lang] ? lang : "thai";
const safeIndex = Number.isInteger(id) && id >= 0 ? id : 0;

const languageLabel = document.getElementById("languageLabel");
const situationTitle = document.getElementById("situationTitle");
const mainPhrase = document.getElementById("mainPhrase");
const practiceLines = document.getElementById("practiceLines");
const backLink = document.getElementById("backLink");

const languageData = languageContent[safeLanguage];
const situation = languageData.situations[safeIndex] || languageData.situations[0];
const langCode = voiceLangByLanguage[safeLanguage] || "en-US";
const practiceTemplates = practiceTemplatesByLanguage[safeLanguage] || practiceTemplatesByLanguage.thai;

function chooseNaturalVoice(code) {
  const base = code.toLowerCase().split("-")[0];
  const voices = window.speechSynthesis.getVoices();
  const candidates = voices.filter(
    (voice) => voice.lang.toLowerCase() === code.toLowerCase() || voice.lang.toLowerCase().startsWith(`${base}-`),
  );

  if (candidates.length === 0) {
    return null;
  }

  const preferredTerms = ["natural", "neural", "premium", "enhanced", "google", "siri", "microsoft", "samantha", "ava"];
  const discouragedTerms = ["espeak", "compact"];

  let best = candidates[0];
  let bestScore = -999;

  candidates.forEach((voice) => {
    const name = voice.name.toLowerCase();
    let score = 0;

    preferredTerms.forEach((term) => {
      if (name.includes(term)) {
        score += 5;
      }
    });

    discouragedTerms.forEach((term) => {
      if (name.includes(term)) {
        score -= 6;
      }
    });

    if (voice.lang.toLowerCase() === code.toLowerCase()) {
      score += 4;
    }

    if (voice.localService) {
      score += 1;
    }

    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  });

  return best;
}

function speak(text, onDone) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    onDone(false);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  const matchedVoice = chooseNaturalVoice(langCode);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.onend = () => onDone(true);
  utterance.onerror = () => onDone(false);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

languageLabel.textContent = `LANGUAGE: ${languageData.displayName.toUpperCase()}`;
situationTitle.innerHTML = `${situation.context} <br><span style="font-size:0.6em; font-weight:normal; color:#666">Roleplay Mode</span>`;
mainPhrase.textContent = situation.phrase;
backLink.href = `situations.html?lang=${encodeURIComponent(safeLanguage)}`;

practiceTemplates.forEach((line) => {
  const row = document.createElement("article");
  row.className = "list-item";
  row.innerHTML = `
    <div>
      <p><strong>Practice</strong></p>
      <p class="small">${line}</p>
    </div>
    <button class="secondary repeat-btn" data-phrase="${line.replaceAll('"', "&quot;")}">Repeat</button>
  `;
  practiceLines.appendChild(row);
});

practiceLines.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains("repeat-btn")) {
    const phrase = (target.dataset.phrase || "").replaceAll('"', "");
    target.textContent = "Playing...";
    target.setAttribute("disabled", "true");
    speak(phrase, (ok) => {
      target.textContent = ok ? "Repeat" : "Audio Unavailable";
      target.removeAttribute("disabled");
    });
  }
});

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
