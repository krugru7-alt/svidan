
const app = document.getElementById('app');

let answers = {
  place: '',
  time: '',
  date: ''
};

const options = {
  place: [
    '🍽️ Поужинаем?',
    '☕ Прогулка и земля',
    '🎬 СЕРДЦЕ ЗВЕРЯ например.',
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

// TELEGRAM
async function notify(event) {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event,
        answers: { ...answers }
      })
    });

    if (!response.ok) {
      console.error('Telegram error:', await response.text());
    }
  } catch (error) {
    console.error('Notification error:', error);
  }
}

// ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
function render(html) {
  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ПОЦЕЛУИ
function kiss() {
  const el = document.createElement('div');
  el.className = 'kiss';
  el.textContent = ['💋', '😘', '💕'][Math.floor(Math.random() * 3)];

  el.style.left = (15 + Math.random() * 70) + 'vw';
  el.style.top = (40 + Math.random() * 35) + 'vh';

  document.body.appendChild(el);

  setTimeout(() => el.remove(), 1400);
}

function kisses() {
  for (let i = 0; i < 5; i++) {
    setTimeout(kiss, i * 110);
  }
}

// 0. ТИТУЛЬНАЯ
function showCover() {
  render(`
    <section class="screen">
      <div class="card">

        <div class="eyebrow">Личное письмо</div>

        <div id="envelope" style="
          font-size:90px;
          margin:20px 0;
          cursor:pointer;
          animation:heartbeat 2s infinite;
        ">💌</div>

        <h1> Моей девочке</h1>

        <p>
          Смотри тут что-то есть
          <br>
          Отправитель подозрительно знаком.
        </p>

        <button class="primary" id="openLetter">
          Тык💗
        </button>

        <p style="font-size:11px;margin-top:20px">
          P.S. Внутри ничего страшного. Наверное.
        </p>

      </div>
    </section>
  `);

  document.getElementById('openLetter').addEventListener('click', () => {
    kisses();

    const envelope = document.getElementById('envelope');
    envelope.textContent = '💖';
    envelope.style.animation = 'none';

    setTimeout(showQuest, 700);
  });
}

// 1. КВЕСТ
function showQuest() {
  render(`
    <section class="screen">
      <div class="card">

        <div class="eyebrow">Секретное задание №001</div>

        <div class="heart">🕵️‍♀️</div>

        <h1>Такс..такс...</h1>

        <p>
          Чё-то тут понатыкали надо разобраться..
        </p>

        <h2 style="font-size:18px">
          ХМ...
        </h2>

        <div class="button-area" id="questArea">
          <button class="primary runaway" id="questButton">
           Тык💗
          </button>
        </div>

        <p id="questHint" style="font-size:11px">
          НОНОНО Кэсся!
        </p>

      </div>
    </section>
  `);

  const btn = document.getElementById('questButton');
  const area = document.getElementById('questArea');
  const hint = document.getElementById('questHint');

  let attempts = 0;

  function escapeButton() {
    if (attempts >= 4) return;

    attempts++;

    const maxX = Math.max(0, area.clientWidth - btn.offsetWidth);
    const maxY = 90;

    btn.style.position = 'absolute';
    btn.style.left = Math.random() * maxX + 'px';
    btn.style.top = (Math.random() * maxY - 20) + 'px';

    const messages = [
      'Почти..',
      'Косая! 😈',
      'ты настойчивая...'
    ];

    hint.textContent = messages[attempts - 1];

    if (attempts === 4) {
      btn.textContent = 'Ну ладно, забирай 😭';
      hint.textContent = 'сдаюсь.';
      btn.style.position = 'relative';
      btn.style.left = 'auto';
      btn.style.top = 'auto';
    }
  }

  btn.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') escapeButton();
  });

  btn.addEventListener('click', () => {
    if (attempts < 4) {
      escapeButton();
      return;
    }

    notify('quest');
    kisses();

    setTimeout(showInvitation, 600);
  });
}

// 2. ПРИГЛАШЕНИЕ
function showInvitation() {
  render(`
    <section class="screen">
      <div class="card">

        <div class="eyebrow">Очень важное предложение</div>

        <div class="heart">🥹</div>

        <h1>Пойдём познакомимся?</h1>

        <div class="button-area" id="answerArea">

          <button class="primary" id="yes">
            Конечно обсид!!! 💗
          </button>

          <button class="secondary" id="no">
            Нет 🙃
          </button>

        </div>

        <p style="font-size:11px">
          Выбор, конечно, за тобой. Но кнопка «Нет» отсутствует.
        </p>

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

  no.addEventListener('pointerenter', e => {
    if (e.pointerType === 'mouse') escapeNo();
  });

  no.addEventListener('click', escapeNo);

  document.getElementById('yes').addEventListener('click', () => {
    notify('consent');
    kisses();

    setTimeout(() => showChoice('place'), 500);
  });
}

// 3. ВЫБОР МЕСТА, ВРЕМЕНИ И ДАТЫ
function showChoice(type) {

  const step = ['place', 'time', 'date'].indexOf(type);

  const titles = {
    place: 'Куда отправимся?',
    time: 'Во сколько начнём?',
    date: 'Когда увидимся?'
  };

  const subtitles = {
    place: 'Ты можешь выбрать место',
    time: 'И время',
    date: 'и дату кстати тоже'
  };

  const progress = {
    place: 33,
    time: 66,
    date: 100
  };

  render(`
    <section class="screen">
      <div class="card">

        <div class="step">ШАГ ${step + 1} ИЗ 3</div>

        <div class="progress">
          <div class="progress-bar"
            style="width:${progress[type]}%">
          </div>
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

      notify(type);
      kisses();

      setTimeout(() => {

        if (type === 'place') showChoice('time');
        else if (type === 'time') showChoice('date');
        else showFinal(false);

      }, 500);

    });

  });

  document.getElementById('selfChoice').addEventListener('click', () => {

    answers[type] = 'Решай сам, у меня лапки 🐾';

    notify('self');
    kisses();

    setTimeout(() => showFinal(true), 500);

  });
}

// 4. ФИНАЛ
function showFinal(selfChoice) {

  let details = '';

  if (selfChoice) {

    details = `
      <p>Я тебя понял🐾</p>

      <h2>Тогда 26.11.2026, 20:00, только ты,я, и земля</h2>

      <p>
        По маньячески? знаю, тебе нравится
      </p>
    `;

  } else {

    details = `
      <h2>Наш план 💌</h2>

      <p>📍 ${answers.place}</p>
      <p>🕒 ${answers.time}</p>
      <p>📅 ${answers.date}</p>

      <p>Ура, осталось доехать!</p>
    `;

  }

  render(`
    <section class="screen">
      <div class="card">

        <div class="final-heart">💗</div>

        <div class="eyebrow">Оформлено</div>

        <h1>Попала,девочка</h1>

        ${details}

        <h2 style="font-size:19px;margin-top:25px">
          💋
        </h2>

        <button class="primary" id="finish"
          style="margin-top:20px">
          Забрать  💌
        </button>

      </div>
    </section>
  `);

  notify('finish');
  kisses();

  document.getElementById('finish').addEventListener('click', () => {

    kisses();

    render(`
      <section class="screen">
        <div class="card">

          <div class="final-heart">💋</div>

          <h1>До встречи, моя любовь!</h1>

        </div>
      </section>
    `);

  });
}

// ЗАПУСК
showCover();
