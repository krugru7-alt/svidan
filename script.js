
const app = document.getElementById('app');

let answers = {
  place: '',
  time: '',
  date: ''
};

let currentStep = 0;

const proposals = {
  place: 'Тогда место я выберу сам. Обещаю, тебе понравится.',
  time: 'Тогда время выбираю я. Тебе останется только подготовиться.',
  date: 'Тогда дату тоже выбираю я. Всё беру на себя.'
};

const options = {
  place: [
    '🍽️ Уютный ресторан',
    '☕ Прогулка и вкусняшки',
    '🎬 Кино и что-нибудь вкусное',
    '🌙 Романтический вечер'
  ],
  time: [
    '14:00',
    '16:00',
    '18:00',
    '20:00'
  ],
  date: [
    '26.11.2026',
    '27.11.2026',
    '28.11.2026',
    '29.11.2026'
  ]
};

function render(html) {
  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function kiss() {
  const el = document.createElement('div');
  el.className = 'kiss';
  el.textContent = '💋';
  el.style.left = (20 + Math.random() * 60) + 'vw';
  el.style.top = (45 + Math.random() * 25) + 'vh';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

function kisses() {
  for (let i = 0; i < 4; i++) {
    setTimeout(kiss, i * 130);
  }
}

// 1. КВЕСТ
function showQuest() {
  render(`
    <section class="screen">
      <div class="card">
        <div class="eyebrow">Секретное задание №001</div>
        <div class="heart">💌</div>
        <h1>Кэсся, тут кое-что для тебя...</h1>
        <p>Но просто так приглашение не получить.<br>
        Сначала придётся немного постараться.</p>
        <h2 style="font-size:17px">Найди и поймай приглашение!</h2>
        <div class="button-area" id="questArea">
          <button class="primary runaway" id="questButton">
            Поймать меня 💗
          </button>
        </div>
        <p style="font-size:11px">Подсказка: оно немного стесняется.</p>
      </div>
    </section>
  `);

  const btn = document.getElementById('questButton');
  const area = document.getElementById('questArea');

  let attempts = 0;

  btn.addEventListener('pointerenter', () => {
    if (attempts >= 5) return;

    attempts++;

    const maxX = Math.max(0, area.clientWidth - btn.offsetWidth);
    const maxY = 100;

    btn.style.position = 'absolute';
    btn.style.left = Math.random() * maxX + 'px';
    btn.style.top = (Math.random() * maxY - 30) + 'px';

    if (attempts === 5) {
      btn.textContent = 'Ладно, лови меня 😭';
    }
  });

  btn.addEventListener('click', () => {
    kisses();
    setTimeout(showInvitation, 500);
  });
}

// 2. ПРИГЛАШЕНИЕ
function showInvitation() {
  render(`
    <section class="screen">
      <div class="card">
        <div class="eyebrow">Очень важное предложение</div>
        <div class="heart">🥹</div>
        <h1>Кэсся, пойдёшь со мной на свидание?</h1>
        <p>Я тут подумал, что нам определённо нужно
        провести немного времени вместе.</p>
        <div class="button-area" id="answerArea">
          <button class="primary" id="yes">Конечно! 💗</button>
          <button class="secondary" id="no">Нет 🙃</button>
        </div>
      </div>
    </section>
  `);

  const no = document.getElementById('no');
  const area = document.getElementById('answerArea');

  function escapeNo() {
    const maxX = Math.max(0, area.clientWidth - no.offsetWidth);
    no.style.position = 'absolute';
    no.style.left = Math.random() * maxX + 'px';
    no.style.top = (Math.random() * 100 - 35) + 'px';
  }

  no.addEventListener('pointerenter', escapeNo);
  no.addEventListener('click', escapeNo);

  document.getElementById('yes').addEventListener('click', () => {
    kisses();
    setTimeout(() => showChoice('place'), 450);
  });
}

// 3. ВЫБОРЫ
function showChoice(type) {
  currentStep = ['place', 'time', 'date'].indexOf(type);

  const titles = {
    place: 'Куда отправимся?',
    time: 'Во сколько начнём?',
    date: 'Когда состоится наше свидание?'
  };

  const subtitles = {
    place: 'Выбирай, где проведём наше маленькое приключение.',
    time: 'Выбирай время, я подстроюсь.',
    date: 'Осталось совсем немного!'
  };

  const progress = {
    place: 33,
    time: 66,
    date: 100
  };

  render(`
    <section class="screen">
      <div class="card">
        <div class="step">ШАГ ${currentStep + 1} ИЗ 3</div>
        <div class="progress">
          <div class="progress-bar" style="width:${progress[type]}%"></div>
        </div>
        <div class="heart">💕</div>
        <h2>${titles[type]}</h2>
        <p>${subtitles[type]}</p>
        <div class="choices">
          ${options[type].map((item, i) => `
            <button class="choice" data-index="${i}">
              ${item}
            </button>
          `).join('')}
          <button class="choice" id="selfChoice">
            🐾 Решай сам, у меня лапки
          </button>
        </div>
      </div>
    </section>
  `);

  document.querySelectorAll('.choice[data-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      answers[type] = options[type][Number(btn.dataset.index)];
      kisses();

      setTimeout(() => {
        if (type === 'place') showChoice('time');
        else if (type === 'time') showChoice('date');
        else showFinal(false);
      }, 450);
    });
  });

  document.getElementById('selfChoice').addEventListener('click', () => {
    answers[type] = 'Решай сам, у меня лапки 🐾';
    kisses();
    setTimeout(() => showFinal(true), 450);
  });
}

// 4. ФИНАЛ
function showFinal(selfChoice) {
  let details = '';

  if (selfChoice) {
    details = `
      <p>Я тебя понял. 🐾</p>
      <h2>Тогда место, время и дата теперь мои!</h2>
      <p>Всё беру на себя. Тебе остаётся только
      красиво появиться и быть собой.</p>
    `;
  } else {
    details = `
      <h2>Наш план:</h2>
      <p>📍 ${answers.place}</p>
      <p>🕒 ${answers.time}</p>
      <p>📅 ${answers.date}</p>
      <p>Теперь осталось только дождаться встречи 💗</p>
    `;
  }

  render(`
    <section class="screen">
      <div class="card">
        <div class="final-heart">💗</div>
        <div class="eyebrow">Приглашение оформлено</div>
        <h1>Ну всё, Кэсся!</h1>
        ${details}
        <h2 style="font-size:19px;margin-top:25px">
          Целую. Твой Обсиди 💋
        </h2>
        <button class="primary" id="finish" style="margin-top:20px">
          Забрать приглашение 💌
        </button>
      </div>
    </section>
  `);

  kisses();
  document.getElementById('finish').addEventListener('click', () => {
    kisses();
    render(`
      <section class="screen">
        <div class="card">
          <div class="final-heart">💋</div>
          <h1>До встречи, Кэсся!</h1>
          <p>Одно свидание. Два человека.<br>
          И куча поводов улыбаться.</p>
        </div>
      </section>
    `);
  });
}

// ЗАПУСК
showQuest();

