
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      ok: false,
      error: "Telegram environment variables are missing"
    });
  }

  const body = req.body || {};

  const lines = [
    "💌 Новое сообщение с приглашения Кэсси",
    "",
    `Статус: ${String(body.status || "Ответ")}`,
    ...(body.answer ? [`Ответ: ${String(body.answer)}`] : []),
    ...(body.date ? [`Дата и время: ${String(body.date)}`] : []),
    ...(body.place ? [`Место: ${String(body.place)}`] : []),
    ...(body.mood ? [`Настроение: ${String(body.mood)}`] : [])
  ];

  try {
    const tg = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n")
        })
      }
    );

    const result = await tg.json();

    if (!tg.ok || !result.ok) {
      const retryAfter =
        result.parameters?.retry_after || 0;

      console.error("Telegram API error:", result);

      return res.status(tg.status === 429 ? 429 : 502).json({
        ok: false,
        error: result.description || "Telegram send failed",
        retry_after: retryAfter
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Submit function error:", error);

    return res.status(500).json({
      ok: false,
      error: error.message || "Server error"
    });
  }
};
