module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: "Telegram environment variables are missing" });
  }

  const body = req.body || {};
  const status = String(body.status || "Ответ");
  const lines = [
    "💌 Новое сообщение с приглашения Кэсси",
    "",
    `Статус: ${status}`,
    ...(body.answer ? [`Ответ: ${body.answer}`] : []),
    ...(body.date ? [`Дата и время: ${body.date}`] : []),
    ...(body.place ? [`Место: ${body.place}`] : []),
    ...(body.mood ? [`Настроение: ${body.mood}`] : [])
  ];
  const text = lines.join("\n");

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const result = await tg.json();
    if (!tg.ok || !result.ok) {
      const reason = result.description || `Telegram HTTP ${tg.status}`;
      console.error("Telegram API error:", reason);
      return res.status(502).json({ ok: false, error: reason });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Submit function error:", error);
    return res.status(500).json({ ok: false, error: error.message || "Server error" });
  }
};
