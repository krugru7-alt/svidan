
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      error: 'Telegram credentials are not configured'
    });
  }

  try {
    const { event, answers } = req.body || {};

    const allowedEvents = [
      'quest',
      'consent',
      'place',
      'time',
      'date',
      'self',
      'finish'
    ];

    if (!allowedEvents.includes(event)) {
      return res.status(400).json({ error: 'Invalid event' });
    }

    const labels = {
      quest: '💌 Кэсся открыла приглашение!',
      consent: '💗 Кэсся согласилась на свидание!',
      place: '📍 Кэсся выбрала место',
      time: '🕒 Кэсся выбрала время',
      date: '📅 Кэсся выбрала дату',
      self: '🐾 Кэсся доверила всё Обсидику!',
      finish: '💕 Кэсся завершила приглашение!'
    };

    const safeAnswers = answers && typeof answers === 'object'
      ? answers
      : {};

    const message = [
      labels[event],
      '',
      safeAnswers.place ? `📍 Место: ${String(safeAnswers.place).slice(0, 150)}` : '',
      safeAnswers.time ? `🕒 Время: ${String(safeAnswers.time).slice(0, 100)}` : '',
      safeAnswers.date ? `📅 Дата: ${String(safeAnswers.date).slice(0, 100)}` : '',
      '',
      `Событие: ${event}`
    ].filter(Boolean).join('\n');

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error('Telegram error:', result);
      return res.status(502).json({
        error: 'Telegram delivery failed'
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Notification error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
