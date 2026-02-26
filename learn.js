const languageContent = window.languageContent;
const params = new URLSearchParams(window.location.search);
let currentLanguage = params.get("lang") || "thai";
if (!languageContent[currentLanguage]) {
  currentLanguage = "thai";
}

let phraseIndex = 0;
let selectedDay = 1;
let currentSpeakText = "";
const completedDaysByLanguage = {};

const phraseText = document.getElementById("phraseText");
const phraseTranslation = document.getElementById("phraseTranslation");
const dayTabs = document.getElementById("dayTabs");
const dayLabel = document.getElementById("dayLabel");
const dayTitle = document.getElementById("dayTitle");
const dayGoal = document.getElementById("dayGoal");
const daySteps = document.getElementById("daySteps");
const prevDayBtn = document.getElementById("prevDayBtn");
const dayListenBtn = document.getElementById("dayListenBtn");
const nextDayBtn = document.getElementById("nextDayBtn");
const completeDayBtn = document.getElementById("completeDayBtn");
const dayStatus = document.getElementById("dayStatus");
const languageSelect = document.getElementById("languageSelect");
const currentLanguageLabel = document.getElementById("currentLanguage");
const listenBtn = document.getElementById("listenBtn");
const nextBtn = document.getElementById("nextBtn");
const backLink = document.getElementById("backLink");

const voiceLangByLanguage = {
  thai: "th-TH",
  vietnamese: "vi-VN",
  indonesian: "id-ID",
  filipino: "fil-PH",
};

// Inject Interactive Styles
const style = document.createElement('style');
style.textContent = `
  .interactive-step { cursor: pointer; padding: 12px; border-radius: 12px; transition: background 0.2s; display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #eee; margin-bottom: 8px; }
  .interactive-step:hover { background: #f0f2f5; border-color: #ccc; }
  .interactive-step.done { opacity: 0.6; }
  .step-check { width: 24px; height: 24px; border: 2px solid #0084ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; flex-shrink: 0; }
  .interactive-step.done .step-check { background: #0084ff; }
`;
document.head.appendChild(style);

function chooseNaturalVoice(langCode) {
  const base = langCode.toLowerCase().split("-")[0];
  const voices = window.speechSynthesis.getVoices();
  const candidates = voices.filter(
    (voice) => voice.lang.toLowerCase() === langCode.toLowerCase() || voice.lang.toLowerCase().startsWith(`${base}-`),
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
    if (voice.lang.toLowerCase() === langCode.toLowerCase()) {
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

function speak(text, langCode, onDone) {
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

function ensureDayCompletionState(languageKey) {
  if (!completedDaysByLanguage[languageKey]) {
    completedDaysByLanguage[languageKey] = Array.from({ length: 7 }, () => false);
  }
}

function getTargetPhrase(languageKey, index) {
  const phrase = languageContent[languageKey].phrases[index % languageContent[languageKey].phrases.length];
  return phrase.speak || phrase.translation;
}

function getWeeklyPlan(languageKey) {
  const languageName = languageContent[languageKey].displayName;
  const situations = languageContent[languageKey].situations;
  return [
    {
      title: "Start with greetings",
      goal: `Learn a basic greeting flow in ${languageName}.`,
      keyPhrase: getTargetPhrase(languageKey, 0),
      steps: [`Say \"${getTargetPhrase(languageKey, 0)}\" 5 times`, "Practice introducing yourself in one short sentence", "Listen and repeat once slowly"],
    },
    {
      title: "Cafe and ordering",
      goal: "Order food or drinks confidently.",
      keyPhrase: getTargetPhrase(languageKey, 1),
      steps: [situations[1]?.phrase || "Practice an ordering phrase", `Say \"${getTargetPhrase(languageKey, 1)}\" 5 times`, "Do one roleplay: customer and staff"],
    },
    {
      title: "Ask for directions",
      goal: "Handle simple location questions.",
      keyPhrase: getTargetPhrase(languageKey, 2),
      steps: [situations[2]?.phrase || "Ask for directions", "Learn one landmark word (station, market, hotel)", "Repeat your key phrase with natural pace"],
    },
    {
      title: "Shopping phrases",
      goal: "Use price and size questions in stores.",
      keyPhrase: getTargetPhrase(languageKey, 0),
      steps: [situations[3]?.phrase || "Practice a shopping phrase", "Ask price + say thank you", "Practice 3 short shopping dialogues"],
    },
    {
      title: "Work or study small talk",
      goal: "Build polite conversation habits.",
      keyPhrase: getTargetPhrase(languageKey, 1),
      steps: ["Use greeting + one follow-up question", "Practice asking for clarification politely", "Repeat your key phrase with better pronunciation"],
    },
    {
      title: "Daily life conversation",
      goal: "Speak in everyday routine contexts.",
      keyPhrase: getTargetPhrase(languageKey, 2),
      steps: ["Describe your day using 2 short sentences", "Practice morning and evening greetings", "Shadow the key phrase 5 times"],
    },
    {
      title: "Weekly review and live practice",
      goal: "Review all key phrases and speak with a native speaker.",
      keyPhrase: getTargetPhrase(languageKey, 0),
      steps: ["Review your favorite phrase from each day", "Listen and repeat all 3 core phrases", "Join one Native Speaker Connect session"],
    },
  ];
}

function renderPhrase() {
  const current = languageContent[currentLanguage].phrases[phraseIndex];
  phraseText.textContent = current.phrase;
  phraseTranslation.textContent = current.translation;
  currentSpeakText = current.speak || "";
}

function renderDayTabs() {
  dayTabs.innerHTML = "";
  for (let day = 1; day <= 7; day += 1) {
    const tab = document.createElement("button");
    tab.className = `day-tab${day === selectedDay ? " active" : ""}`;
    tab.textContent = `D${day}`;
    tab.type = "button";
    tab.dataset.day = String(day);
    dayTabs.appendChild(tab);
  }
}

function renderWeeklyPath() {
  ensureDayCompletionState(currentLanguage);
  const dayPlan = getWeeklyPlan(currentLanguage)[selectedDay - 1];
  dayLabel.textContent = `DAY ${selectedDay}`;
  dayTitle.innerHTML = `${dayPlan.title} <span style="font-size:0.5em; color:#0084ff; background:#eef; padding:2px 6px; border-radius:4px; vertical-align:middle; margin-left:6px">Interactive</span>`;
  dayGoal.textContent = dayPlan.goal;
  daySteps.innerHTML = "";
  dayPlan.steps.forEach((step) => {
    const item = document.createElement("li");
    item.className = "interactive-step";
    item.innerHTML = `<div class="step-check"></div><span>${step}</span>`;
    item.onclick = () => {
      item.classList.toggle("done");
      item.querySelector(".step-check").textContent = item.classList.contains("done") ? "✓" : "";
    };
    daySteps.appendChild(item);
  });

  const completed = completedDaysByLanguage[currentLanguage];
  const completedCount = completed.filter(Boolean).length;
  const isDone = completed[selectedDay - 1];
  completeDayBtn.textContent = isDone ? "Completed" : "Mark Day Complete";
  completeDayBtn.disabled = isDone;
  dayListenBtn.textContent = "Listen Key Phrase";
  dayListenBtn.disabled = false;
  dayStatus.textContent = `${completedCount} of 7 days completed`;
  prevDayBtn.disabled = selectedDay === 1;
  nextDayBtn.disabled = selectedDay === 7;
  renderDayTabs();
}

function renderLanguage() {
  languageSelect.value = currentLanguage;
  currentLanguageLabel.textContent = `Learning: ${languageContent[currentLanguage].displayName}`;
  backLink.href = `index.html?lang=${encodeURIComponent(currentLanguage)}`;
  renderPhrase();
  renderWeeklyPath();
}

languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  phraseIndex = 0;
  selectedDay = 1;
  renderLanguage();
});

nextBtn.addEventListener("click", () => {
  const phraseCount = languageContent[currentLanguage].phrases.length;
  phraseIndex = (phraseIndex + 1) % phraseCount;
  renderPhrase();
});

listenBtn.addEventListener("click", () => {
  listenBtn.textContent = "Playing...";
  listenBtn.disabled = true;
  const langCode = voiceLangByLanguage[currentLanguage] || "en-US";
  speak(currentSpeakText, langCode, (ok) => {
    listenBtn.textContent = ok ? "Listen" : "Audio Unavailable";
    listenBtn.disabled = false;
  });
});

dayTabs.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains("day-tab")) {
    selectedDay = Number(target.dataset.day || "1");
    renderWeeklyPath();
  }
});

prevDayBtn.addEventListener("click", () => {
  selectedDay = Math.max(1, selectedDay - 1);
  renderWeeklyPath();
});

nextDayBtn.addEventListener("click", () => {
  selectedDay = Math.min(7, selectedDay + 1);
  renderWeeklyPath();
});

dayListenBtn.addEventListener("click", () => {
  const plan = getWeeklyPlan(currentLanguage)[selectedDay - 1];
  dayListenBtn.textContent = "Playing...";
  dayListenBtn.disabled = true;
  const langCode = voiceLangByLanguage[currentLanguage] || "en-US";
  speak(plan.keyPhrase, langCode, (ok) => {
    dayListenBtn.textContent = ok ? "Listen Key Phrase" : "Audio Unavailable";
    dayListenBtn.disabled = false;
  });
});

completeDayBtn.addEventListener("click", () => {
  ensureDayCompletionState(currentLanguage);
  completedDaysByLanguage[currentLanguage][selectedDay - 1] = true;
  renderWeeklyPath();
});

renderLanguage();
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
