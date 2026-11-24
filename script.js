// Здесь можно менять личные предложения Обсиди для варианта «Сам решай».
const proposals = {
  date: "Тогда я сам выберу удобный для нас день и время. Предупрежу тебя заранее, чтобы ты спокойно подготовилась.",
  place: "Я выберу уютное место, где мы сможем спокойно провести время вдвоём. Пусть это будет мой маленький сюрприз для тебя.",
  mood: "Тогда готовься к романтическому вечеру. Остальное оставь мне, а от тебя потребуется только хорошее настроение."
};

const answers = { date: "", place: "", mood: "" };
const labels = { date: "Дата и время", place: "Место", mood: "Настроение" };
const screens = [...document.querySelectorAll(".screen")];
const toast = document.getElementById("toast");
let toastTimer;

function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({top: 0, behavior: "smooth"});
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function selectedValue(key) {
  const custom = document.getElementById(key + "Custom");
  return custom && custom.value.trim() ? "Свой вариант: " + custom.value.trim() : answers[key];
}
function refreshNext(key) {
  const screen = document.getElementById("step-" + key);
  const btn = screen.querySelector(".next");
  btn.disabled = !selectedValue(key);
}
function setChoice(key, value, button) {
  answers[key] = value;
  document.querySelectorAll(`[data-choice="${key}"]`).forEach(b => b.classList.toggle("selected", b === button));
  const proposal = document.getElementById(key + "Proposal");
  if (value === "Сам решай, у меня лапки") {
    proposal.innerHTML = `<strong>Тогда мой вариант:</strong><br>${proposals[key]}`;
    proposal.hidden = false;
  } else {
    proposal.hidden = true;
  }
  const custom = document.getElementById(key + "Custom");
  if (custom) custom.value = "";
  refreshNext(key);
}
document.querySelectorAll("[data-choice]").forEach(button => {
  button.addEventListener("click", () => setChoice(button.dataset.choice, button.dataset.value, button));
});
["date","place","mood"].forEach(key => {
  document.getElementById(key + "Custom").addEventListener("input", () => {
    answers[key] = "";
    document.querySelectorAll(`[data-choice="${key}"]`).forEach(b => b.classList.remove("selected"));
    document.getElementById(key + "Proposal").hidden = true;
    refreshNext(key);
  });
});
document.getElementById("yesBtn").addEventListener("click", () => {
  showScreen("step-date");
  burst();
});
document.getElementById("noBtn").addEventListener("click", async () => {
  showScreen("declined");
  burst();
  await sendResponse({status:"Отказ", answer:"Кэсся нажала «Нет»"});
});
document.getElementById("returnBtn").addEventListener("click", () => showScreen("welcome"));
document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => showScreen(b.dataset.back)));
document.querySelectorAll(".next").forEach(b => b.addEventListener("click", async () => {
  const current = b.closest(".screen").id.replace("step-","");
  answers[current] = selectedValue(current);
  if (b.dataset.next === "finish") {
    renderSummary();
    showScreen("finish");
    burst();
    await sendResponse({status:"Приглашение принято", ...answers});
  } else {
    showScreen(b.dataset.next);
  }
}));
function renderSummary() {
  const html = ["date","place","mood"].map(k =>
    `<div class="summary-row"><b>${labels[k]}</b><span>${escapeHtml(answers[k] || "Не указано")}</span></div>`
  ).join("");
  document.getElementById("summary").innerHTML = html;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
async function sendResponse(payload) {
  try {
    const response = await fetch("/api/submit", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("send failed");
    notify("Ответ отправлен Обсиди ♡");
  } catch (e) {
    notify("Ответ показан на сайте, но отправка в Telegram не удалась.");
    console.error(e);
  }
}
function burst() {
  const symbols = ["♡","✿","✧","🌸","🐈"];
  const holder = document.getElementById("petals");
  for (let i=0;i<24;i++) {
    const el = document.createElement("span");
    el.className = "petal";
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left = Math.random()*100+"vw";
    el.style.animationDuration = (4+Math.random()*4)+"s";
    el.style.animationDelay = (Math.random()*.8)+"s";
    holder.appendChild(el);
    setTimeout(()=>el.remove(),9000);
  }
}