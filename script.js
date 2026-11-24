
// Личные предложения Обсиди для варианта «Сам решай».
const proposals = {
  date: "Тогда я сам выберу удобный для нас день и время. Предупрежу тебя заранее, чтобы ты спокойно подготовилась.",
  place: "Я выберу уютное место, где мы сможем спокойно провести время вдвоём. Пусть это будет мой маленький сюрприз для тебя.",
  mood: "Тогда готовься к романтическому вечеру. Остальное оставь мне, а от тебя потребуется только хорошее настроение."
};

const answers = { date: "", time: "", place: "", mood: "" };
const labels = {
  date: "Дата и время",
  place: "Место",
  mood: "Настроение"
};

const screens = [...document.querySelectorAll(".screen")];
const toast = document.getElementById("toast");

let toastTimer;
let sending = false;
let sent = false;

function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function selectedValue(key) {
  const custom = document.getElementById(key + "Custom");

  if (custom && custom.value.trim()) {
    return "Свой вариант: " + custom.value.trim();
  }

  if (key === "date") {
    return answers.date && answers.time
      ? `${answers.date} · ${answers.time}`
      : "";
  }

  return answers[key];
}

function refreshNext(key) {
  const screen = document.getElementById("step-" + key);
  const btn = screen.querySelector(".next");
  btn.disabled = !selectedValue(key);
}

function setChoice(key, value, button) {
  answers[key] = value;

  document.querySelectorAll(`[data-choice="${key}"]`)
    .forEach(b => b.classList.toggle("selected", b === button));

  if (key === "date") {
    const proposal = document.getElementById("dateProposal");

    if (value === "Сам решай, у меня лапки") {
      answers.time = "Время выберу сам";
      proposal.innerHTML = `<strong>Тогда мой вариант:</strong><br>${proposals.date}`;
      proposal.hidden = false;
    } else {
      proposal.hidden = true;
      if (answers.time === "Время выберу сам") answers.time = "";
    }

    const custom = document.getElementById("dateCustom");
    if (custom) custom.value = "";
  }

  refreshNext(key === "time" ? "date" : key);
}

document.querySelectorAll("[data-choice]").forEach(button => {
  button.addEventListener("click", () => {
    setChoice(button.dataset.choice, button.dataset.value, button);
  });
});

["date", "place", "mood"].forEach(key => {
  document.getElementById(key + "Custom").addEventListener("input", () => {
    answers[key] = "";

    if (key === "date") answers.time = "";

    document.querySelectorAll(
      `[data-choice="${key}"], [data-choice="time"]`
    ).forEach(b => b.classList.remove("selected"));

    const proposal = document.getElementById(key + "Proposal");
    if (proposal) proposal.hidden = true;

    refreshNext(key);
  });
});

// Квест перед выбором даты, места и настроения.
const startQuestBtn = document.getElementById("startQuestBtn");
const catchBtn = document.getElementById("catchBtn");
const catchStage = document.getElementById("catchStage");
const catchProgress = document.getElementById("catchProgress");
const questHint = document.getElementById("questHint");

let catches = 0;

startQuestBtn.addEventListener("click", () => {
  catches = 0;
  updateCatchProgress();
  showScreen("quest");
  moveCatchButton();
});

function updateCatchProgress() {
  catchProgress.style.width = `${(catches / 3) * 100}%`;

  questHint.textContent = catches === 0
    ? "Она будет немного хитрить. Совсем чуть-чуть."
    : `Есть ${catches} из 3! Ещё немного ловкости.`;
}

function moveCatchButton() {
  const maxX = Math.max(0, catchStage.clientWidth - catchBtn.offsetWidth);
  const maxY = Math.max(0, catchStage.clientHeight - catchBtn.offsetHeight);

  catchBtn.style.left = `${Math.random() * maxX}px`;
  catchBtn.style.top = `${Math.random() * maxY}px`;
}

catchBtn.addEventListener("click", () => {
  catches++;

  if (catches >= 3) {
    showScreen("quest-choice");
    burst();
    return;
  }

  updateCatchProgress();
  moveCatchButton();
});

document.getElementById("questBackBtn").addEventListener("click", () => {
  showScreen("welcome");
});

document.querySelectorAll("[data-quest-answer]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.questAnswer === "correct") {
      showScreen("quest-win");
      burst();
    } else {
      const hint = document.getElementById("choiceHint");
      hint.textContent = "Не-а. Обсидику даже немного обидно за вариант с выходом 😏";

      button.classList.add("wrong-answer");
      setTimeout(() => button.classList.remove("wrong-answer"), 500);
    }
  });
});

document.getElementById("openChoicesBtn").addEventListener("click", () => {
  showScreen("step-date");
  burst();
});

// Кнопка «Нет» ускользает.
const noBtn = document.getElementById("noBtn");

function dodgeNoButton() {
  const pad = 12;
  const maxX = Math.max(pad, window.innerWidth - noBtn.offsetWidth - pad);
  const maxY = Math.max(pad, window.innerHeight - noBtn.offsetHeight - pad);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${pad + Math.random() * (maxX - pad)}px`;
  noBtn.style.top = `${pad + Math.random() * (maxY - pad)}px`;
  noBtn.style.zIndex = "20";
}

noBtn.addEventListener("pointerenter", dodgeNoButton);

noBtn.addEventListener("touchstart", event => {
  event.preventDefault();
  dodgeNoButton();
}, { passive: false });

noBtn.addEventListener("click", event => {
  event.preventDefault();
  dodgeNoButton();
});

document.getElementById("returnBtn").addEventListener("click", () => {
  showScreen("welcome");
});

document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.back));
});

// Переходы между этапами и единственная отправка ответа.
document.querySelectorAll(".next").forEach(button => {
  button.addEventListener("click", async () => {
    const current = button.closest(".screen").id.replace("step-", "");
    answers[current] = selectedValue(current);

    if (button.dataset.next === "finish") {
      if (sending || sent) return;

      sending = true;
      button.disabled = true;

      renderSummary();
      showScreen("finish");
      burst();

      const success = await sendResponse({
        status: "Приглашение принято",
        date: selectedValue("date"),
        place: answers.place,
        mood: answers.mood
      });

      sent = success;
      sending = false;
      button.disabled = false;

    } else {
      showScreen(button.dataset.next);
    }
  });
});

function renderSummary() {
  const html = ["date", "place", "mood"].map(key => {
    const value = key === "date"
      ? selectedValue("date")
      : answers[key];

    return `
      <div class="summary-row">
        <b>${labels[key]}</b>
        <span>${escapeHtml(value || "Не указано")}</span>
      </div>
    `;
  }).join("");

  document.getElementById("summary").innerHTML = html;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Отправка ответа в Telegram через Vercel API.
async function sendResponse(payload) {
  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.ok) {
      const wait = result.retry_after
        ? ` Повтори через ${result.retry_after} сек.`
        : "";

      throw new Error(
        (result.error || `HTTP ${response.status}`) + wait
      );
    }

    notify("Ответ отправлен Обсиди ♡");
    return true;

  } catch (error) {
    notify("Не удалось отправить: " + (error.message || "ошибка"));
    console.error("Telegram send error:", error);
    return false;
  }
}

// Анимация бусек и лепестков.
function burst() {
  const symbols = ["♡", "✿", "✧", "🌸", "🐈"];
  const holder = document.getElementById("petals");

  for (let i = 0; i < 24; i++) {
    const el = document.createElement("span");

    el.className = "petal";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = (4 + Math.random() * 4) + "s";
    el.style.animationDelay = (Math.random() * 0.8) + "s";

    holder.appendChild(el);
    setTimeout(() => el.remove(), 9000);
  }
}
