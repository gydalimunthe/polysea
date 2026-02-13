const contentByPurpose = {
  study: {
    badge: "Study",
    phrase: '"Where is the lecture hall?"',
    translation: 'Thai: "Hong rian yuu tee nai?"',
    title: "Campus Essentials in Bangkok",
    description: "Fast Thai phrases for university life, class discussions, and student services.",
    level: "Beginner",
    duration: "12 min",
    type: "Video + Quiz",
  },
  work: {
    badge: "Work",
    phrase: '"Can we align on the delivery timeline?"',
    translation: 'Vietnamese: "Chung ta co the thong nhat tien do giao hang khong?"',
    title: "SEA Business Meetings",
    description: "Practical language for meetings, client updates, and cross-border teamwork.",
    level: "Intermediate",
    duration: "15 min",
    type: "Roleplay Drill",
  },
  travel: {
    badge: "Travel",
    phrase: '"How much is this?"',
    translation: 'Bahasa Indonesia: "Berapa harganya?"',
    title: "Street Market Survival Phrases",
    description: "Speak naturally in markets, transport hubs, and local neighborhoods.",
    level: "Beginner",
    duration: "10 min",
    type: "Audio + Practice",
  },
  daily: {
    badge: "Daily",
    phrase: '"I am learning your language every day."',
    translation: 'Filipino: "Nag-aaral ako ng wika mo araw-araw."',
    title: "Everyday Conversations",
    description: "Build confidence with greetings, food orders, and home routine talk.",
    level: "All levels",
    duration: "8 min",
    type: "Daily Challenge",
  },
};

const purposeButtons = document.querySelectorAll(".purpose-tile");
const purposeBadge = document.getElementById("purposeBadge");
const phraseText = document.getElementById("phraseText");
const phraseTranslation = document.getElementById("phraseTranslation");
const lessonTitle = document.getElementById("lessonTitle");
const lessonDescription = document.getElementById("lessonDescription");
const lessonLevel = document.getElementById("lessonLevel");
const lessonDuration = document.getElementById("lessonDuration");
const lessonType = document.getElementById("lessonType");
const languageList = document.getElementById("language-list");
const languageBtn = document.getElementById("languageBtn");
const listenBtn = document.getElementById("listenBtn");
const practiceBtn = document.getElementById("practiceBtn");

const languages = [
  "Thai | English | Vietnamese | Bahasa Indonesia",
  "English | Thai | Tagalog | Khmer",
  "English | Vietnamese | Bahasa Melayu | Lao",
];

let currentLanguageSet = 0;

function applyPurpose(purposeKey) {
  const data = contentByPurpose[purposeKey];
  purposeBadge.textContent = data.badge;
  phraseText.textContent = data.phrase;
  phraseTranslation.textContent = data.translation;
  lessonTitle.textContent = data.title;
  lessonDescription.textContent = data.description;
  lessonLevel.textContent = data.level;
  lessonDuration.textContent = data.duration;
  lessonType.textContent = data.type;
}

purposeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    purposeButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    applyPurpose(btn.dataset.purpose);
  });
});

languageBtn.addEventListener("click", () => {
  currentLanguageSet = (currentLanguageSet + 1) % languages.length;
  languageList.textContent = languages[currentLanguageSet];
});

listenBtn.addEventListener("click", () => {
  listenBtn.textContent = "Playing...";
  setTimeout(() => {
    listenBtn.textContent = "Listen";
  }, 900);
});

practiceBtn.addEventListener("click", () => {
  practiceBtn.textContent = "Great!";
  setTimeout(() => {
    practiceBtn.textContent = "Practice";
  }, 850);
});
